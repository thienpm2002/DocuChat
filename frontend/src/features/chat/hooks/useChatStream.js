import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { chatApi } from "@/api/chatApi"

export const useChatStream = () => {

    const [pendingMessages, setPendingMessages] = useState([])
    const [status, setStatus] = useState("idle")

    const queryClient = useQueryClient()

    const createMessageMutation = useMutation({
        mutationFn: ({ chatSessionId, content }) =>
            chatApi.createMessage(chatSessionId, content)
    })

    const handlerChatStream = async (text, chatSessionId) => {

        let aiMessageId = crypto.randomUUID()

        // luôn giữ bản cuối cùng của assistant
        let assistantContent = ""

        setStatus("loading")

        setPendingMessages(prev => [
            ...prev,
           {
                id: Date.now(),
                sender: "USER",
                content: text
            }
        ])

        try {

            const response = await createMessageMutation.mutateAsync({
                chatSessionId,
                content: text
            })

            if (!response.ok) {
                console.error(
                    "Response error:",
                    response.status,
                    await response.text()
                )
                return
            }

            setPendingMessages(prev => [
                ...prev,
                {
                    id: aiMessageId,
                    sender: "ASSISTANT",
                    content: "",
                    isStreaming: true,
                    sources: []
                }
            ])

            setStatus("streaming")
            
           // Parse text
            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            let buffer = ""

            while (true) {

                const { done, value } = await reader.read()

                if (done) break

                buffer += decoder.decode(value, {
                    stream: true
                })

                const parts = buffer.split("\n\n")

                buffer = parts.pop()

                for (const part of parts) {

                    if (!part.trim()) continue

                    const lines = part.trim().split("\n")

                    const eventName =
                        lines
                            .find(line => line.startsWith("event:"))
                            ?.slice(6)
                            .trim()

                    const dataLine =
                        lines.find(line =>
                            line.startsWith("data:")
                        )

                    if (!dataLine) continue

                    const data =
                        dataLine.slice(5).trim()

                    // =====================
                    // Metadata
                    // =====================

                    if (eventName === "metadata") {

                        const { messageId, sources } =
                            JSON.parse(data)

                        setPendingMessages(prev =>
                            prev.map(message =>
                                message.id === aiMessageId
                                    ? {
                                        ...message,
                                        id: messageId,
                                        sources
                                    }
                                    : message
                            )
                        )

                        aiMessageId = messageId

                        continue
                    }

                    // =====================
                    // Error
                    // =====================

                    if (eventName === "error") {

                        const { message } = JSON.parse(data)

                        assistantContent = message

                        setPendingMessages(prev =>
                            prev.map(message =>
                                message.id === aiMessageId
                                    ? {
                                        ...message,
                                        content: assistantContent
                                    }
                                    : message
                            )
                        )

                        await queryClient.invalidateQueries({
                            queryKey: ["messages", chatSessionId],
                        });

                        await reader.cancel()

                        setPendingMessages([])

                        return
                    }

                    // =====================
                    // Done
                    // =====================

                    if (
                        eventName === "done"
                    ) {

                        await queryClient.invalidateQueries({
                            queryKey: ["messages", chatSessionId],
                        });
                        
                        await reader.cancel()

                        setPendingMessages([])

                        return
                    }

                    // =====================
                    // Normal chunk
                    // =====================

                    if (eventName === "token") {

                        const token = JSON.parse(data)

                        assistantContent += token.text

                        setPendingMessages(prev =>
                            prev.map(message =>
                                message.id === aiMessageId
                                    ? {
                                        ...message,
                                        content: assistantContent
                                    }
                                    : message
                            )
                        )

                        continue
                    }

                }

            }

        } catch (error) {

            console.error("Stream error:", error)

            setPendingMessages(prev =>
                prev.filter(
                    message => message.id !== aiMessageId
                )
            )

            toast.error(
                "Connection lost. Please try again."
            )

        } finally {

            setStatus("idle")

        }

    }

    return {
        status,
        pendingMessages,
        handlerChatStream
    }

}