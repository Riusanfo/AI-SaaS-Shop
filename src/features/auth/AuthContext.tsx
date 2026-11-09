import { useState, useEffect, type ReactNode } from 'react';
import type { User, SignUpInput, SignInInput } from './types';
import { authService } from './authService';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // Очищаем старые артефакты мокового хранилища
    try {
      localStorage.removeItem('shop_saas_auth_user');
    } catch {
      // Игнорируем ошибки доступа к localStorage
    }

    authService
      .getMe()
      .then(currentUser => {
        if (isMounted) {
          setUser(currentUser);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const signUp = async (data: SignUpInput) => {
    const createdUser = await authService.signUp(data);
    setUser(createdUser);
  };

  const signIn = async (data: SignInInput) => {
    const authenticatedUser = await authService.signIn(data);
    setUser(authenticatedUser);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
