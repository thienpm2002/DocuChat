// features/chat/pages/ChatDetailPage.jsx
import {  useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, FileText } from "lucide-react"
import MessageList from "../components/MessageList"
import ChatInput from "../components/ChatInput"
import { useChatSession, useMessages, useChatStream } from "../hooks"

import LoadingScreen from "@/shared/components/LoadingScreen"

const ChatDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: chatSession } = useChatSession(id)
  const { 
      data: pageData, 
      isPending,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage
  } = useMessages({ chatSessionId: id })

  const {status, pendingMessages, handlerChatStream} = useChatStream();

  const historyMessages = useMemo(() => {
      const history =
          pageData?.pages
              .flatMap(page => page.data)
              .reverse() ?? []

      return [    
          ...history
      ]
  }, [pageData])

  const messages = useMemo(() => {
      return [
          ...historyMessages,
          ...pendingMessages
      ]
  }, [historyMessages, pendingMessages])


  const handleSend = (text) => {
    handlerChatStream(text, id);
  }

  return (
    <div className="flex flex-col h-screen pb-15 md:pb-0">
      <header className="h-14 border-b border-border flex items-center gap-3 px-4 shrink-0 bg-background">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-accent cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="w-7 h-7 rounded-md bg-red-50 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-red-500" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{chatSession?.title}</p>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">Ready</span> · 1 session
          </p>
        </div>
      </header>

      {
        isPending ? 
        <LoadingScreen /> 
        : 
        <MessageList
          messages={messages}
          isLoading={status === 'loading'}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      }

      <ChatInput
        onSend={handleSend}
        disabled={status !== 'idle'}
      />
    </div>
  )
}

export default ChatDetailPage