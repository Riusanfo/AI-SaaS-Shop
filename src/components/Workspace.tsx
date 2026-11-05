import { useState } from 'react'

interface WorkspaceProps {
  activeTab: string
  setActiveTab: (tab: 'home' | 'create' | 'benefits' | 'guide') => void
}

export function Workspace({ activeTab, setActiveTab }: WorkspaceProps) {
  const [storeName, setStoreName] = useState('')
  const [productCategory, setProductCategory] = useState('')
  const [isGenerated, setIsGenerated] = useState(false)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!storeName.trim()) return
    setIsGenerated(true)
  }

  return (
    <div className="workspace-inner">
      {activeTab === 'home' && (
        <div className="hero-pane">
          <div className="hero-badge">ИИ-платформа нового поколения</div>
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

          {!isGenerated ? (
            <form className="creator-form" onSubmit={handleGenerate}>
              <div className="form-group">
                <label htmlFor="store-name">Название магазина или товара</label>
                <input
                  id="store-name"
                  type="text"
                  placeholder="Например: Ароматические свечи ручной работы"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Категория</label>
                <input
                  id="category"
                  type="text"
                  placeholder="Например: Дом и уход"
                  value={productCategory}
                  onChange={e => setProductCategory(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary">
                Сгенерировать магазин
              </button>
            </form>
          ) : (
            <div className="success-preview">
              <div className="success-banner">
                <h3>Магазин «{storeName}» успешно сгенерирован!</h3>
                <p>ИИ подготовил для вас структуру каталога, базовый дизайн и первые товары.</p>
              </div>
              <button className="btn-secondary" onClick={() => setIsGenerated(false)}>
                Создать другой магазин
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'benefits' && (
        <div className="benefits-pane">
          <h2>Преимущества платформы</h2>
          <p className="pane-subtitle">Почему выбирают Knife.inc для быстрого старта</p>
          <div className="benefits-stack">
            <div className="b-item">
              <span className="b-num">01</span>
              <div>
                <h3>Быстрый запуск</h3>
                <p>Готовый интернет-магазин с каталогом и корзиной за 60 минут без написания кода.</p>
              </div>
            </div>
            <div className="b-item">
              <span className="b-num">02</span>
              <div>
                <h3>Умный ИИ-помощник</h3>
                <p>Автоматическая генерация продающих описаний товаров и SEO-тегов для поисковиков.</p>
              </div>
            </div>
            <div className="b-item">
              <span className="b-num">03</span>
              <div>
                <h3>Честные условия</h3>
                <p>Никаких скрытых платежей и блокировок на старте. Создавайте и тестируйте бесплатно.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="guide-pane">
          <h2>Инструкция по работе</h2>
          <p className="pane-subtitle">Простые шаги от идеи до готового бизнеса</p>
          <div className="guide-list">
            <div className="guide-step">
              <strong>Шаг 1.</strong> Зарегистрируйтесь на платформе в один клик.
            </div>
            <div className="guide-step">
              <strong>Шаг 2.</strong> Опишите ваш товар нашему ИИ-ассистенту Verity.
            </div>
            <div className="guide-step">
              <strong>Шаг 3.</strong> Проверьте сгенерированный дизайн и подключите платежи (sandbox).
            </div>
            <div className="guide-step">
              <strong>Шаг 4.</strong> Опубликуйте магазин и принимайте первых покупателей.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
