import { useState, useRef, type FormEvent } from 'react';
import type { RegisterableRole } from './types';
import { useAuth } from './useAuth';
import styles from './AuthModal.module.css';

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<RegisterableRole>('STORE_OWNER');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const roleOwnerRef = useRef<HTMLInputElement>(null);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError('');

    let hasError = false;
    let firstInvalidRef: HTMLInputElement | null = null;

    if (!email.trim() || !emailPattern.test(email.trim())) {
      setEmailError('Введите email в формате name@example.com');
      hasError = true;
      if (!firstInvalidRef) firstInvalidRef = emailInputRef.current;
    } else {
      setEmailError('');
    }

    if (!password || password.length < 8) {
      setPasswordError('Пароль должен содержать от 8 символов');
      hasError = true;
      if (!firstInvalidRef) firstInvalidRef = passwordInputRef.current;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword || confirmPassword !== password) {
      setConfirmPasswordError('Пароли не совпадают');
      hasError = true;
      if (!firstInvalidRef) firstInvalidRef = confirmPasswordInputRef.current;
    } else {
      setConfirmPasswordError('');
    }

    if (!role) {
      setRoleError('Выберите роль: Владелец магазина или Покупатель');
      hasError = true;
      if (!firstInvalidRef) firstInvalidRef = roleOwnerRef.current;
    } else {
      setRoleError('');
    }

    if (hasError) {
      firstInvalidRef?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({
        email: email.trim(),
        password,
        role,
      });
      onSuccess();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Не удалось зарегистрироваться');
      emailInputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formGroup}>
        <label htmlFor="signup-email" className={styles.label}>
          Электронная почта
        </label>
        <input
          ref={emailInputRef}
          id="signup-email"
          type="email"
          autoComplete="email"
          className={`${styles.input} ${emailError ? styles.inputInvalid : ''}`}
          placeholder="name@example.com"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'signup-email-error' : undefined}
        />
        {emailError && (
          <span id="signup-email-error" className={styles.fieldError} role="alert">
            {emailError}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="signup-password" className={styles.label}>
          Пароль
        </label>
        <input
          ref={passwordInputRef}
          id="signup-password"
          type="password"
          autoComplete="new-password"
          className={`${styles.input} ${passwordError ? styles.inputInvalid : ''}`}
          placeholder="Минимум 8 символов"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError('');
          }}
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? 'signup-password-error' : undefined}
        />
        {passwordError && (
          <span id="signup-password-error" className={styles.fieldError} role="alert">
            {passwordError}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="signup-confirm" className={styles.label}>
          Подтверждение пароля
        </label>
        <input
          ref={confirmPasswordInputRef}
          id="signup-confirm"
          type="password"
          autoComplete="new-password"
          className={`${styles.input} ${confirmPasswordError ? styles.inputInvalid : ''}`}
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={e => {
            setConfirmPassword(e.target.value);
            if (confirmPasswordError) setConfirmPasswordError('');
          }}
          aria-invalid={Boolean(confirmPasswordError)}
          aria-describedby={confirmPasswordError ? 'signup-confirm-error' : undefined}
        />
        {confirmPasswordError && (
          <span id="signup-confirm-error" className={styles.fieldError} role="alert">
            {confirmPasswordError}
          </span>
        )}
      </div>

      <fieldset className={styles.radioGroup} role="radiogroup" aria-labelledby="role-legend">
        <legend id="role-legend" className={styles.radioLegend}>
          Роль в системе
        </legend>

        <label
          className={`${styles.radioOption} ${role === 'STORE_OWNER' ? styles.radioOptionSelected : ''}`}
        >
          <input
            ref={roleOwnerRef}
            type="radio"
            name="role"
            value="STORE_OWNER"
            checked={role === 'STORE_OWNER'}
            onChange={() => {
              setRole('STORE_OWNER');
              if (roleError) setRoleError('');
            }}
            className={styles.radioInput}
          />
          <div className={styles.radioTextGroup}>
            <span className={styles.radioLabel}>Владелец магазина</span>
            <span className={styles.radioDescription}>Создание витрины, настройка каталога и управление товарами</span>
          </div>
        </label>

        <label
          className={`${styles.radioOption} ${role === 'BUYER' ? styles.radioOptionSelected : ''}`}
        >
          <input
            type="radio"
            name="role"
            value="BUYER"
            checked={role === 'BUYER'}
            onChange={() => {
              setRole('BUYER');
              if (roleError) setRoleError('');
            }}
            className={styles.radioInput}
          />
          <div className={styles.radioTextGroup}>
            <span className={styles.radioLabel}>Покупатель</span>
            <span className={styles.radioDescription}>Просмотр каталогов магазинов и оформление заказов</span>
          </div>
        </label>

        {roleError && (
          <span id="signup-role-error" className={styles.fieldError} role="alert">
            {roleError}
          </span>
        )}
      </fieldset>

      {serverError && (
        <div className={styles.serverErrorBanner} role="alert">
          {serverError}
        </div>
      )}

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Создаём аккаунт…' : 'Создать аккаунт'}
      </button>

      <div className={styles.switchPrompt}>
        <span>Уже есть аккаунт?</span>
        <button type="button" className={styles.switchButton} onClick={onSwitchToLogin}>
          Войти
        </button>
      </div>
    </form>
  );
}
