import { useState } from 'react'

interface WorkspaceProps {
  activeTab: string
  setActiveTab: (tab: 'home' | 'create' | 'benefits' | 'guide') => void
}

export function Workspace({ activeTab, setActiveTab }: WorkspaceProps) {
  const [storeName, setStoreName] = useState('')
  const [productCategory, setProductCategory] = useState('')
  const [isGenerated, setIsGenerated] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<'minimal' | 'neon' | 'warm'>('minimal')

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!storeName.trim()) return
    setIsGenerated(true)
  }

  return (
    <div className="workspace-inner">
      {activeTab === 'home' && (
        <div className="hero-pane">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            ИИ-платформа нового поколения
          </div>
          <h1 className="hero-headline">
            Создайте интернет-магазин за 60 минут с помощью ИИ
          </h1>
          <p className="hero-subline">
            Забудьте про сложную вёрстку, рутинный дизайн и ручное заполнение SEO-тегов. Наш ассистент Verity сделает всю тяжёлую работу за вас.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setActiveTab('create')}>
              Запустить конструктор
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab('benefits')}>
              Узнать преимущества
            </button>
          </div>

          <div className="hero-preview-card">
            <div className="preview-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="preview-title">knife-inc-preview.ai/store</span>
            </div>
            <div className="preview-body">
              <div className="preview-mock-store">
                <div className="mock-nav">Knife.store</div>
                <div className="mock-hero-text">Ароматические свечи ручной работы</div>
                <div className="mock-grid">
                  <div className="mock-item"></div>
                  <div className="mock-item"></div>
                  <div className="mock-item"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="creator-pane">
          <div className="pane-header-group">
            <h2>Генерация магазина с ИИ</h2>
            <p className="pane-subtitle">Опишите вашу идею, и нейросеть создаст уникальный каркас витрины.</p>
          </div>

          {!isGenerated ? (
            <form className="creator-form" onSubmit={handleGenerate}>
              <div className="form-group">
                <label htmlFor="store-name">Название магазина или ключевой товар</label>
                <input
                  id="store-name"
                  type="text"
                  placeholder="Например: Уютные свечи из соевого воска"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Категория каталога</label>
                <input
                  id="category"
                  type="text"
                  placeholder="Например: Дом, декор, подарки"
                  value={productCategory}
                  onChange={e => setProductCategory(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Выберите стиль витрины</label>
                <div className="template-selector">
                  <div
                    className={`template-option ${selectedTemplate === 'minimal' ? 'active' : ''}`}
                    onClick={() => setSelectedTemplate('minimal')}
                  >
                    <strong>Minimal</strong>
                    <span>Строгий монохром</span>
                  </div>
                  <div
                    className={`template-option ${selectedTemplate === 'neon' ? 'active' : ''}`}
                    onClick={() => setSelectedTemplate('neon')}
                  >
                    <strong>Cyber Neon</strong>
                    <span>Тёмный неон</span>
                  </div>
                  <div
                    className={`template-option ${selectedTemplate === 'warm' ? 'active' : ''}`}
                    onClick={() => setSelectedTemplate('warm')}
                  >
                    <strong>Warm Craft</strong>
                    <span>Тёплые текстуры</span>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary full-width">
                Сгенерировать магазин
              </button>
            </form>
          ) : (
            <div className="success-preview">
              <div className="success-banner">
                <div className="success-icon">✨</div>
                <h3>Магазин «{storeName}» готов!</h3>
                <p>Мы создали структуру в стиле <strong>{selectedTemplate}</strong>, сгенерировали описания товаров и подключили корзину.</p>
              </div>
              <div className="success-actions">
                <button className="btn-primary" onClick={() => alert('Переход в панель управления...')}>
                  Открыть админку
                </button>
                <button className="btn-secondary" onClick={() => setIsGenerated(false)}>
                  Создать другой
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'benefits' && (
        <div className="benefits-pane">
          <div className="pane-header-group">
            <h2>Почему Knife.inc?</h2>
            <p className="pane-subtitle">Инженерный подход к созданию интернет-магазинов без лишней сложности.</p>
          </div>
          <div className="benefits-stack">
            <div className="b-item">
              <span className="b-num">01</span>
              <div>
                <h3>Молниеносный запуск</h3>
                <p>В отличие от громоздких CMS, вы получаете работающий e-commerce сайт за 60 минут с настроенной базой данных и мультитенантностью.</p>
              </div>
            </div>
            <div className="b-item">
              <span className="b-num">02</span>
              <div>
                <h3>ИИ-копирайтинг и SEO</h3>
                <p>Нейросеть мгновенно пишет продающие карточки товаров и оптимизирует мета-теги для поисковых роботов Яндекса и Google.</p>
              </div>
            </div>
            <div className="b-item">
              <span className="b-num">03</span>
              <div>
                <h3>Честная экономика</h3>
                <p>Никаких платных подписок и оплат до того, как вы увидите готовый результат. Полная свобода в sandbox-режиме.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="guide-pane">
          <div className="pane-header-group">
            <h2>Инструкция для команды</h2>
            <p className="pane-subtitle">Как устроена работа с платформой и код-ревью.</p>
          </div>
          <div className="guide-list">
            <div className="guide-step">
              <strong>01.</strong> Используйте карточки задач из директории <code>AI/tasks/</code> для каждой новой фичи.
            </div>
            <div className="guide-step">
              <strong>02.</strong> Соблюдайте изоляцию данных по <code>storeId</code> на всех сервереных эндпоинтах.
            </div>
            <div className="guide-step">
              <strong>03.</strong> Проверяйте входные данные через общие Zod-схемы в папке <code>shared/</code>.
            </div>
            <div className="guide-step">
              <strong>04.</strong> Перед коммитом всегда запускайте скрипт проверки <code>scripts/validate.sh</code>.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
