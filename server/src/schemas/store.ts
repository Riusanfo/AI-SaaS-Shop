import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Название магазина должно содержать от 2 символов')
    .max(100, 'Название магазина не должно превышать 100 символов'),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Адрес витрины (slug) должен содержать от 3 символов')
    .max(50, 'Адрес витрины (slug) не должен превышать 50 символов')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Адрес витрины может содержать только строчные латинские буквы, цифры и дефисы (без пробелов)'
    ),
  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Цвет должен быть в формате HEX (#RRGGBB)')
    .optional(),
  templateId: z.enum(['minimal', 'catalog', 'story']).optional(),
});

export const updateStoreSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Название магазина должно содержать от 2 символов')
    .max(100, 'Название магазина не должно превышать 100 символов')
    .optional(),
  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Цвет должен быть в формате HEX (#RRGGBB)')
    .optional(),
  templateId: z.enum(['minimal', 'catalog', 'story']).optional(),
  blocks: z.array(z.record(z.string(), z.unknown())).optional(),
  isPublished: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Название товара должно содержать от 2 символов')
    .max(150, 'Название товара не должно превышать 150 символов'),
  description: z
    .string()
    .max(2000, 'Описание товара не должно превышать 2000 символов')
    .optional()
    .default(''),
  price: z
    .number()
    .int('Цена должна быть целым числом')
    .min(0, 'Цена не может быть отрицательной'),
  imageUrl: z
    .string()
    .url('Некорректная ссылка на изображение')
    .optional()
    .or(z.literal('')),
  category: z
    .string()
    .max(50, 'Категория не должна превышать 50 символов')
    .optional(),
});

export type CreateStoreDto = z.infer<typeof createStoreSchema>;
export type UpdateStoreDto = z.infer<typeof updateStoreSchema>;
export type ProductDto = z.infer<typeof productSchema>;
