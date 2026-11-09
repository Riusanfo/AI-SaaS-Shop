import { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/useAuth';
import styles from './Header.module.css';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: 'home' | 'create' | 'benefits' | 'guide') => void;
  onOpenAuth: () => void;
}

export function Header({ activeTab, setActiveTab, onOpenAuth }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className={styles.header}>
      <div className={styles.brandWrapper}>
        <div className={styles.brand} onClick={() => setActiveTab('home')}>
          Knife.inc
        </div>
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

      <div className={styles.actions}>
        {user ? (
          <div className={styles.authGroup}>
            <div className={styles.userBadge} title={user.email}>
              <span className={styles.userEmail}>{user.email}</span>
              <span className={styles.roleTag}>
                {user.role === 'STORE_OWNER' ? 'Владелец' : user.role === 'BUYER' ? 'Покупатель' : user.role}
              </span>
            </div>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={() => void signOut()}
              title="Выйти из аккаунта"
            >
              Выйти
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={styles.loginBtn}
            onClick={onOpenAuth}
          >
            Войти
          </button>
        )}

        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Переключить на ${theme === 'light' ? 'тёмную' : 'светлую'} тему`}
          title={`Тема: ${theme === 'light' ? 'Светлая (Тёплый лён)' : 'Тёмная (Обожжённый дуб)'}`}
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
