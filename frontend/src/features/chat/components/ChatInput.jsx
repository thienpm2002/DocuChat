// features/chat/components/ChatInput.jsx
import { useState, useRef } from "react"
import { SendHorizonal } from "lucide-react"

const ChatInput = ({ onSend, disabled = false }) => {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleSend = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
    // reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    setValue(e.target.value)
    // auto resize
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
  }

  return (
    <div className="shrink-0 px-4 py-3 bg-background pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="max-w-3xl mx-auto flex items-end gap-2 bg-accent rounded-xl px-4 py-2 border border-border">
        <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask about this document…"
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none max-h-40 leading-relaxed py-1.5"
        />
        <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 mb-0.5 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
            <SendHorizonal className="w-4 h-4 text-primary-foreground" />
        </button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-1.5">
        Press Enter to send · Shift+Enter for new line
        </p>
    </div>
    )
}

export default ChatInput