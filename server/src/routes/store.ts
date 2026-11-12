import { Router, type Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../db.js';
import {
  requireAuth,
  requireRole,
  type AuthenticatedRequest,
} from '../middleware/auth.js';
import {
  createStoreSchema,
  updateStoreSchema,
  productSchema,
} from '../schemas/store.js';

export const storeRouter = Router();

/**
 * Получение магазина текущего владельца с товарами
 * GET /api/stores/me
 */
storeRouter.get(
  '/stores/me',
  requireAuth,
  requireRole('STORE_OWNER'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const store = await prisma.store.findFirst({
        where: { ownerId: req.user!.id },
        include: {
          products: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!store) {
        res.status(404).json({
          error: {
            code: 'STORE_NOT_FOUND',
            message: 'У вас пока нет созданного магазина. Создайте витрину, чтобы начать продажи.',
          },
        });
        return;
      }

      res.status(200).json({ store });
    } catch {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Не удалось получить данные магазина. Пожалуйста, повторите попытку позже.',
        },
      });
    }
  }
);

/**
 * Создание первого магазина для владельца
 * POST /api/stores
 */
storeRouter.post(
  '/stores',
  requireAuth,
  requireRole('STORE_OWNER'),
  async (req: AuthenticatedRequest, res: Response) => {
    const parseResult = createStoreSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: {
          code: 'VALIDATION',
          message: parseResult.error.issues[0]?.message || 'Ошибка валидации входящих данных.',
        },
      });
      return;
    }

    const { name, slug, accentColor, templateId } = parseResult.data;

    try {
      // Проверка: есть ли уже магазин у текущего владельца (1 магазин на владельца в MVP)
      const existingOwnerStore = await prisma.store.findFirst({
        where: { ownerId: req.user!.id },
      });

      if (existingOwnerStore) {
        res.status(409).json({
          error: {
            code: 'STORE_EXISTS',
            message: 'У вас уже создан магазин. Вы можете обновить его настройки.',
            storeId: existingOwnerStore.id,
          },
        });
        return;
      }

      // Проверка уникальности адреса витрины (slug)
      const existingSlug = await prisma.store.findUnique({
        where: { slug },
      });

      if (existingSlug) {
        res.status(409).json({
          error: {
            code: 'SLUG_TAKEN',
            message: 'Магазин с таким адресом уже существует. Выберите другой адрес витрины.',
          },
        });
        return;
      }

      const store = await prisma.store.create({
        data: {
          ownerId: req.user!.id,
          name,
          slug,
          accentColor: accentColor || '#C87A24',
          templateId: templateId || 'minimal',
          blocks: [],
          isPublished: false,
        },
      });

      res.status(201).json({ store });
    } catch {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Не удалось создать магазин. Пожалуйста, повторите попытку позже.',
        },
      });
    }
  }
);

/**
 * Обновление конфигурации витрины текущего владельца
 * PUT /api/stores/me
 */
storeRouter.put(
  '/stores/me',
  requireAuth,
  requireRole('STORE_OWNER'),
  async (req: AuthenticatedRequest, res: Response) => {
    const parseResult = updateStoreSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: {
          code: 'VALIDATION',
          message: parseResult.error.issues[0]?.message || 'Ошибка валидации входящих данных.',
        },
      });
      return;
    }

    try {
      const store = await prisma.store.findFirst({
        where: { ownerId: req.user!.id },
      });

      if (!store) {
        res.status(404).json({
          error: {
            code: 'STORE_NOT_FOUND',
            message: 'Магазин не найден. Сначала создайте магазин.',
          },
        });
        return;
      }

      const updatedStore = await prisma.store.update({
        where: { id: store.id },
        data: {
          ...(parseResult.data.name !== undefined && { name: parseResult.data.name }),
          ...(parseResult.data.accentColor !== undefined && { accentColor: parseResult.data.accentColor }),
          ...(parseResult.data.templateId !== undefined && { templateId: parseResult.data.templateId }),
          ...(parseResult.data.blocks !== undefined && { blocks: parseResult.data.blocks as Prisma.InputJsonValue }),
          ...(parseResult.data.isPublished !== undefined && { isPublished: parseResult.data.isPublished }),
        },
      });

      res.status(200).json({ store: updatedStore });
    } catch {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Не удалось обновить магазин. Пожалуйста, повторите попытку позже.',
        },
      });
    }
  }
);

/**
 * Добавление товара в каталог магазина текущего владельца
 * POST /api/stores/me/products
 */
storeRouter.post(
  '/stores/me/products',
  requireAuth,
  requireRole('STORE_OWNER'),
  async (req: AuthenticatedRequest, res: Response) => {
    const parseResult = productSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: {
          code: 'VALIDATION',
          message: parseResult.error.issues[0]?.message || 'Ошибка валидации данных товара.',
        },
      });
      return;
    }

    try {
      // Гарантированная изоляция: находим магазин текущего владельца
      const store = await prisma.store.findFirst({
        where: { ownerId: req.user!.id },
      });

      if (!store) {
        res.status(404).json({
          error: {
            code: 'STORE_NOT_FOUND',
            message: 'Магазин не найден. Создайте витрину перед добавлением товаров.',
          },
        });
        return;
      }

      const product = await prisma.product.create({
        data: {
          storeId: store.id,
          name: parseResult.data.name,
          description: parseResult.data.description,
          price: parseResult.data.price,
          imageUrl: parseResult.data.imageUrl || null,
          category: parseResult.data.category || null,
        },
      });

      res.status(201).json({ product });
    } catch {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Не удалось добавить товар. Пожалуйста, повторите попытку позже.',
        },
      });
    }
  }
);

/**
 * Удаление товара из каталога (с проверкой принадлежности магазину владельца)
 * DELETE /api/stores/me/products/:productId
 */
storeRouter.delete(
  '/stores/me/products/:productId',
  requireAuth,
  requireRole('STORE_OWNER'),
  async (req: AuthenticatedRequest, res: Response) => {
    const { productId } = req.params;

    try {
      const store = await prisma.store.findFirst({
        where: { ownerId: req.user!.id },
      });

      if (!store) {
        res.status(404).json({
          error: {
            code: 'STORE_NOT_FOUND',
            message: 'Магазин не найден.',
          },
        });
        return;
      }

      // Изоляция данных: удаляем товар только если его storeId совпадает со store.id владельца!
      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          storeId: store.id,
        },
      });

      if (!product) {
        res.status(404).json({
          error: {
            code: 'PRODUCT_NOT_FOUND',
            message: 'Товар не найден или не принадлежит вашему магазину.',
          },
        });
        return;
      }

      await prisma.product.delete({
        where: { id: product.id },
      });

      res.status(204).end();
    } catch {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Не удалось удалить товар. Пожалуйста, повторите попытку позже.',
        },
      });
    }
  }
);

/**
 * Публичный маршрут витрины магазина (для покупателей и гостей)
 * GET /api/stores/public/:slug
 */
storeRouter.get('/stores/public/:slug', async (req: AuthenticatedRequest, res: Response) => {
  const { slug } = req.params;

  try {
    const store = await prisma.store.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!store || !store.isPublished) {
      res.status(404).json({
        error: {
          code: 'STORE_NOT_FOUND',
          message: 'Магазин не найден или ещё не опубликован владельцем.',
        },
      });
      return;
    }

    // Возвращаем только публичные поля витрины (без ownerId и внутренних служебных полей)
    res.status(200).json({
      store: {
        name: store.name,
        slug: store.slug,
        accentColor: store.accentColor,
        templateId: store.templateId,
        blocks: store.blocks,
        products: store.products.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          imageUrl: p.imageUrl,
          category: p.category,
        })),
      },
    });
  } catch {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Не удалось загрузить витрину магазина.',
      },
    });
  }
});
