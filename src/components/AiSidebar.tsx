import { useState } from 'react'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
}

interface AiSidebarProps {
  messages: Message[]
  onSendMessage: (text: string) => void
  isThinking: boolean
}

export function AiSidebar({ messages, onSendMessage, isThinking }: AiSidebarProps) {
  const [inputMessage, setInputMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return
    onSendMessage(inputMessage)
    setInputMessage('')
  }

  return (
    <aside className="ai-sidebar">
      <div className="ai-sidebar-header">
        <div className="ai-avatar-badge">✨</div>
        <span className="ai-name">AI Pro 1488</span>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            <p>{msg.text}</p>
            <span className="timestamp">{msg.timestamp}</span>
          </div>
        ))}
        {isThinking && (
          <div className="chat-bubble ai thinking">
            <p>Verity thinking... 6s</p>
          </div>
        )}
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Спросите ИИ о чем угодно..."
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
        />
        <button type="submit" aria-label="Отправить">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
    </aside>
  )
}
