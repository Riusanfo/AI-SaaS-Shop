export type Role = 'PLATFORM_ADMIN' | 'STORE_OWNER' | 'STORE_MANAGER' | 'BUYER';

export type RegisterableRole = 'STORE_OWNER' | 'BUYER';

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface SignUpInput {
  email: string;
  password: string;
  role: RegisterableRole;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (data: SignInInput) => Promise<void>;
  signUp: (data: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
}
