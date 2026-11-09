import styles from './AuthPrompt.module.css';

// ПРИМЕЧАНИЕ ПО БЕЗОПАСНОСТИ: это подсказка интерфейса, настоящая проверка прав будет на сервере.
interface AuthPromptProps {
  type: 'guest' | 'buyer';
  onOpenAuth: () => void;
  onGoHome?: () => void;
}

export function AuthPrompt({ type, onOpenAuth, onGoHome }: AuthPromptProps) {
  if (type === 'guest') {
    return (
      <div className={styles.promptCard}>
        <div className={styles.iconWrapper}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <div className={styles.titleGroup}>
          <h2>Требуется авторизация</h2>
          <p className={styles.description}>
            Конструктор интернет-магазинов доступен авторизованным пользователям.
            Войдите в свой аккаунт или зарегистрируйтесь, чтобы создать витрину.
          </p>
        </div>

        <div className={styles.securityNote}>
          Подсказка интерфейса: настоящая проверка прав и изоляция данных выполняются на сервере.
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.btnPrimary} onClick={onOpenAuth}>
            Войти или зарегистрироваться
          </button>
          {onGoHome && (
            <button type="button" className={styles.btnSecondary} onClick={onGoHome}>
              На главную
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.promptCard}>
      <div className={styles.iconWrapper}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <div className={styles.titleGroup}>
        <h2>Доступ к конструктору ограничен</h2>
        <p className={styles.description}>
          Ваш текущий аккаунт зарегистрирован с ролью <strong>«Покупатель»</strong>.
          Конструктор витрин и управление каталогом предназначены исключительно для владельцев магазинов (роль STORE_OWNER).
        </p>
      </div>

      <div className={styles.securityNote}>
        Подсказка интерфейса: настоящая проверка прав и изоляция данных выполняются на сервере.
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btnPrimary} onClick={onOpenAuth}>
          Сменить аккаунт
        </button>
        {onGoHome && (
          <button type="button" className={styles.btnSecondary} onClick={onGoHome}>
            На главную
          </button>
        )}
      </div>
    </div>
  );
}
