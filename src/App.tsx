import { useState } from 'react'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'create' | 'benefits' | 'guide'>('home')

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo" onClick={() => setActiveTab('home')}>
          Knife.<br />inc
        </div>
        <nav className="nav">
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
        <div className="ai-profile">
          <div className="ai-avatar">✨</div>
          <span>AI Pro 1488</span>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'home' && (
          <div className="hero-section">
            <h1 className="hero-title">
              Это сайт
            </h1>
            <p className="hero-subtitle">
              Разработанный для создания интернет-магазина с ИИ помощником
            </p>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="section-card">
            <h2>Создание с помощью ИИ</h2>
            <p className="section-desc">Уменьшите время создания шаблона при помощи ИИ</p>
            <div className="stub-box">
              <span>Заглушка</span>
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="section-card">
            <h2>Плюсы платформы</h2>
            <div className="benefits-grid">
              <div className="benefit-item">Плюшка 1: Быстрый старт</div>
              <div className="benefit-item">Плюшка 2: Умный ИИ-ассистент</div>
              <div className="benefit-item">Плюшка 3: Безопасные платежи</div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="section-card">
            <h2>Инструкция</h2>
            <p className="section-desc">Как запустить интернет-магазин за 60 минут.</p>
          </div>
        )}
      </main>
    </div>
  )
}
