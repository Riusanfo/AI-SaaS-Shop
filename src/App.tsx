import { useState } from 'react'
import { Header } from './components/Header'
import { Workspace } from './components/Workspace'
import { AiSidebar } from './components/AiSidebar'
import './App.css'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'create' | 'benefits' | 'guide'>('home')
  const [isAiOpen, setIsAiOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hi! Im Verity. Your friend is an assistant! Ask anything, I know everything!', timestamp: '12:00' }
  ])
  const [isThinking, setIsThinking] = useState(false)

  const handleSendMessage = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setIsThinking(true)

    setTimeout(() => {
      let aiResponse = "I've noted that! Let me help you set up your store."
      if (text.toLowerCase().includes('export')) {
        aiResponse = "Exporting store configuration... Done! Ready for deployment."
      } else if (text.toLowerCase().includes('свче') || text.toLowerCase().includes('свеч')) {
        aiResponse = "Свечи — отличный выбор! Я создал структуру каталога и подобрал тёплую палитру."
      }

      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponse, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ])
      setIsThinking(false)
    }, 1500)
  }

  return (
    <div className="layout-root">
      <div className={`workspace-column ${isAiOpen ? 'with-sidebar' : 'full-width'}`}>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-viewport">
          <Workspace activeTab={activeTab} setActiveTab={setActiveTab} />
        </main>
      </div>

      <AiSidebar
        messages={messages}
        onSendMessage={handleSendMessage}
        isThinking={isThinking}
        isOpen={isAiOpen}
        onToggle={() => setIsAiOpen(prev => !prev)}
      />
    </div>
  )
}
