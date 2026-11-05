import { useState } from 'react'
import { Header } from './components/Header'
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
  const [storeName, setStoreName] = useState('')
  const [productCategory, setProductCategory] = useState('')
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
      <div className="workspace-column">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

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

      <AiSidebar
        messages={messages}
        onSendMessage={handleSendMessage}
        index-key={0}
        isThinking={isThinking}
      />
    </div>
  )
}
