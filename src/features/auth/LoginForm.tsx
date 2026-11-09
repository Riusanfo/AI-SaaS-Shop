import { useState, useRef, type FormEvent } from 'react';
import { useAuth } from './useAuth';
import styles from './AuthModal.module.css';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

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

    if (hasError) {
      firstInvalidRef?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn({ email: email.trim(), password });
      onSuccess();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Не удалось выполнить вход');
      emailInputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formGroup}>
        <label htmlFor="login-email" className={styles.label}>
          Электронная почта
        </label>
        <input
          ref={emailInputRef}
          id="login-email"
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
          aria-describedby={emailError ? 'login-email-error' : undefined}
        />
        {emailError && (
          <span id="login-email-error" className={styles.fieldError} role="alert">
            {emailError}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="login-password" className={styles.label}>
          Пароль
        </label>
        <input
          ref={passwordInputRef}
          id="login-password"
          type="password"
          autoComplete="current-password"
          className={`${styles.input} ${passwordError ? styles.inputInvalid : ''}`}
          placeholder="Минимум 8 символов"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError('');
          }}
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? 'login-password-error' : undefined}
        />
        {passwordError && (
          <span id="login-password-error" className={styles.fieldError} role="alert">
            {passwordError}
          </span>
        )}
      </div>

      {serverError && (
        <div className={styles.serverErrorBanner} role="alert">
          {serverError}
        </div>
      )}

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Входим…' : 'Войти'}
      </button>

      <div className={styles.switchPrompt}>
        <span>Нет аккаунта?</span>
        <button type="button" className={styles.switchButton} onClick={onSwitchToSignup}>
          Зарегистрироваться
        </button>
      </div>
    </form>
  );
}
