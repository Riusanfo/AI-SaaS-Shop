import { z } from 'zod';

export const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Введите email в формате name@example.com'),
  password: z
    .string()
    .min(8, 'Пароль должен содержать от 8 символов')
    .max(128, 'Пароль не должен превышать 128 символов'),
  role: z.enum(['STORE_OWNER', 'BUYER'], {
    message: 'Выберите роль: Владелец магазина (STORE_OWNER) или Покупатель (BUYER)',
  }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Введите email в формате name@example.com'),
  password: z
    .string()
    .min(1, 'Введите пароль'),
});

export type SignUpDto = z.infer<typeof signupSchema>;
export type SignInDto = z.infer<typeof loginSchema>;
