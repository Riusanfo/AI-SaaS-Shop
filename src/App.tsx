import { useState } from 'react'
import './App.css'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'create' | 'benefits' | 'guide'>('home')
  const [storeName, setStoreName] = useState('')
  const [productCategory, setProductCategory] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hi! Im Verity. Your friend is an assistant! Ask anything, I know everything!', timestamp: '12:00' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isThinking, setIsThinking] = useState(false)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    const currentInput = inputMessage
    setInputMessage('')
    setIsThinking(true)

    setTimeout(() => {
      let aiResponse = "I've noted that! Let me help you set up your store."
      if (currentInput.toLowerCase().includes('export')) {
        aiResponse = "Exporting store configuration... Done! Ready for deployment."
      } else if (currentInput.toLowerCase().includes('свче') || currentInput.toLowerCase().includes('свеч')) {
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
      {/* Main workspace */}
      <div className="workspace-column">
        <header className="top-header">
          <div className="brand" onClick={() => setActiveTab('home')}>
            Knife.<br />inc
          </div>
          <nav className="nav-menu">
            <button className={activeTab === 'create' ? 'active' : ''} onClick={() => setActiveTab('create')}>
              Создать
            </button>
            <button className={activeTab === 'benefits' ? 'active' : ''} onClick={() => setActiveTab('benefits')}>
              Плюсы
            </button>
            <button className={activeTab === 'guide' ? 'active' : ''} onClick={() => setActiveTab('guide')}>
              Инструкция
            </button>
          </nav>
        </header>

        <main className="main-viewport">
          {activeTab === 'home' && (
            <div className="hero-pane">
              <h1 className="hero-headline">
                Это сайт
              </h1>
              <p className="hero-subline">
                Разработанный для создания интернет-магазина с ИИ помощником
              </p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => setActiveTab('create')}>
                  Создать магазин за 60 минут
                </button>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="creator-pane">
              <h2>Создание с помощью ИИ</h2>
              <p className="pane-subtitle">Уменьшите время создания шаблона при помощи ИИ</p>
              <div className="form-group">
                <label>Название магазина или товара</label>
                <input
                  type="text"
                  placeholder="Например: Ароматические свечи ручной работы"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Категория</label>
                <input
                  type="text"
                  placeholder="Например: Дом и уход"
                  value={productCategory}
                  onChange={e => setProductCategory(e.target.value)}
                />
              </div>
              <button className="btn-primary" onClick={() => alert('Магазин создан!')}>
                Сгенерировать магазин
              </button>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="benefits-pane">
              <h2>Преимущества платформы</h2>
              <div className="benefits-cards">
                <div className="b-card">
                  <h3>Быстрый старт</h3>
                  <p>Запуск готового магазина с каталогом за 60 минут без кода.</p>
                </div>
                <div className="b-card">
                  <h3>Умный ИИ-помощник</h3>
                  <p>Генерация описаний товаров и SEO-тегов в один клик.</p>
                </div>
                <div className="b-card">
                  <h3>Без скрытых плат</h3>
                  <p>Создавайте и настраивайте магазин бесплатно перед публикацией.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="guide-pane">
              <h2>Руководство по запуску</h2>
              <ol className="guide-steps">
                <li>Зарегистрируйтесь в системе.</li>
                <li>Расскажите ИИ-помощнику Verity, что вы планируете продавать.</li>
                <li>Проверьте сгенерированный каталог и подключите приём платежей в sandbox.</li>
                <li>Опубликуйте ваш интернет-магазин.</li>
              </ol>
            </div>
          )}
        </main>
      </div>

      {/* AI Assistant Sidebar (Verity) */}
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

        <form className="chat-input-form" onSubmit={handleSendMessage}>
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
    </div>
  )
}
