import styles from './Header.module.css';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: 'home' | 'create' | 'benefits' | 'guide') => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand} onClick={() => setActiveTab('home')}>
        Knife.<br />inc
      </div>
      <nav className={styles.nav}>
        <button
          className={`${styles.navLink} ${activeTab === 'create' ? styles.active : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Создать
        </button>
        <button
          className={`${styles.navLink} ${activeTab === 'benefits' ? styles.active : ''}`}
          onClick={() => setActiveTab('benefits')}
        >
          Плюсы
        </button>
        <button
          className={`${styles.navLink} ${activeTab === 'guide' ? styles.active : ''}`}
          onClick={() => setActiveTab('guide')}
        >
          Инструкция
        </button>
      </nav>
    </header>
  );
}
