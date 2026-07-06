import {
    useState,
    useEffect,
    useLayoutEffect,
    useRef
} from "react"

import { Bot } from "lucide-react"

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'USER'

  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-accent border border-border flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      )}

      <div className={`max-w-[80%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
            ${isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-accent text-accent-foreground rounded-bl-sm'
            }
          `}
        >
          {message.content}
          {message.isStreaming && (
            <span className="inline-block w-1 h-4 bg-current ml-0.5 animate-pulse align-middle" />
          )}
        </div>

        {message.sources?.length > 0 && (
          <div className="px-3 py-1.5 bg-blue-50 border-l-2 border-blue-400 rounded-r-md text-xs text-blue-600">
            📄 {message.sources
                .map(source => `Trang ${source.page + 1}`)
                .join(" · ")
            }
          </div>
        )}
      </div>
    </div>
  )
}


const MessageList = ({
    messages = [],
    isLoading = false,
    onLoadMore,
    hasNextPage,
    isFetchingNextPage,
}) => {

    const containerRef = useRef(null)
    const topRef = useRef(null)
    const bottomRef = useRef(null)

    const previousHeight = useRef(0)
    const isPrepending = useRef(false)

    const [ready, setReady] = useState(false)

    const lastMessageId = messages.at(-1)?.id

    // ==========================
    // Scroll xuống cuối lần đầu
    // ==========================

    useLayoutEffect(() => {

        if (ready) return
        if (messages.length === 0) return

        requestAnimationFrame(() => {

            containerRef.current.scrollTop =
                containerRef.current.scrollHeight

            setReady(true)

        })

    }, [messages.length, ready])

    // ==========================
    // Observe top sentinel
    // ==========================

    useEffect(() => {

        if (!ready) return
        if (!hasNextPage) return

        const observer = new IntersectionObserver(

            ([entry]) => {

                if (
                    !entry.isIntersecting ||
                    isFetchingNextPage ||
                    isPrepending.current
                ) {
                    return
                }

                isPrepending.current = true

                previousHeight.current =
                    containerRef.current.scrollHeight

                onLoadMore?.()

            },

            {
                root: containerRef.current,
                threshold: 0
            }

        )

        observer.observe(topRef.current)

        return () => observer.disconnect()

    }, [
        ready,
        hasNextPage,
        isFetchingNextPage,
        onLoadMore
    ])

    // ==========================
    // Sau khi prepend message
    // giữ nguyên vị trí scroll
    // ==========================

    useLayoutEffect(() => {

        if (!isPrepending.current) return

        if (isFetchingNextPage) return

        requestAnimationFrame(() => {

            const container = containerRef.current

            const diff =
                container.scrollHeight -
                previousHeight.current

            container.scrollTop += diff

            previousHeight.current = 0
            isPrepending.current = false

        })

    }, [
        messages.length,
        isFetchingNextPage
    ])

    useEffect(() => {

        if (!ready) return

        if (isPrepending.current) return

        requestAnimationFrame(() => {

            containerRef.current?.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth"
            })

        })

    }, [
        lastMessageId,
        ready
    ])

    return (

        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-4"
        >

            <div ref={topRef} className="h-px" />

            {isFetchingNextPage && (
                <div className="text-center text-xs text-muted-foreground">
                    Loading...
                </div>
            )}

            {messages.map(message => (
                <MessageBubble
                    key={message.id}
                    message={message}
                />
            ))}

            {isLoading && (
                <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent border border-border flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>

                    <div className="px-4 py-3 bg-accent rounded-2xl rounded-bl-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                    </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    )
}

export default MessageList