interface HeaderProps {
  activeTab: string
  setActiveTab: (tab: 'home' | 'create' | 'benefits' | 'guide') => void
  onToggleAi: () => void
  isAiOpen: boolean
}

export function Header({ activeTab, setActiveTab, onToggleAi, isAiOpen }: HeaderProps) {
  return (
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
      <button className="ai-toggle-btn" onClick={onToggleAi} aria-label="Переключить ИИ-ассистента">
        ✨ {isAiOpen ? 'Скрыть ИИ' : 'ИИ Веррити'}
      </button>
    </header>
  )
}
