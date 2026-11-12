// TODO: вынести в shared (типы Role и User пока дублируются на клиенте и сервере)
export type Role = 'PLATFORM_ADMIN' | 'STORE_OWNER' | 'STORE_MANAGER' | 'BUYER';

export interface UserSummary {
  id: string;
  email: string;
  role: Role;
}
