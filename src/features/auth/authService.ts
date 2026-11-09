import type { SignUpInput, SignInInput, User } from './types';

interface AuthResponse {
  user: User;
}

interface ErrorResponse {
  error?: {
    code?: string;
    message?: string;
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = 'Произошла ошибка при выполнении запроса';
    try {
      const data = (await res.json()) as ErrorResponse;
      if (data?.error?.message) {
        errorMessage = data.error.message;
      }
    } catch {
      // Игнорируем ошибку парсинга JSON, используем дефолтное сообщение
    }
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}

export const authService = {
  async signUp(input: SignUpInput): Promise<User> {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(input),
    });

    const data = await handleResponse<AuthResponse>(res);
    return data.user;
  },

  async signIn(input: SignInInput): Promise<User> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(input),
    });

    const data = await handleResponse<AuthResponse>(res);
    return data.user;
  },

  async signOut(): Promise<void> {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok && res.status !== 401) {
      throw new Error('Не удалось завершить сессию на сервере');
    }
  },

  async getMe(): Promise<User | null> {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.status === 401) {
        return null;
      }

      const data = await handleResponse<AuthResponse>(res);
      return data.user;
    } catch {
      return null;
    }
  },
};
