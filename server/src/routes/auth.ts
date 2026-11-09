import { Router, type Response } from 'express';
import { randomBytes } from 'node:crypto';
import { prisma } from '../db.js';
import { config } from '../config.js';
import { signupSchema, loginSchema } from '../schemas/auth.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import {
  requireAuth,
  requireRole,
  setSessionCookie,
  clearSessionCookie,
  parseCookies,
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
  type AuthenticatedRequest,
} from '../middleware/auth.js';

export const authRouter = Router();

/**
 * Регистрация нового пользователя
 * POST /api/auth/signup
 */
authRouter.post('/auth/signup', async (req: AuthenticatedRequest, res: Response) => {
  const parseResult = signupSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION',
        message: parseResult.error.issues[0]?.message || 'Ошибка валидации входящих данных.',
      },
    });
    return;
  }

  const { email, password, role } = parseResult.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        error: {
          code: 'EMAIL_TAKEN',
          message: 'Пользователь с таким email уже зарегистрирован. Пожалуйста, выполните вход.',
        },
      });
      return;
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
      },
    });

    // Создание сессии в БД
    const sessionId = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        expiresAt,
      },
    });

    setSessionCookie(res, sessionId, expiresAt);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Не удалось завершить регистрацию. Пожалуйста, повторите попытку позже.',
      },
    });
  }
});

/**
 * Вход в аккаунт
 * POST /api/auth/login
 */
authRouter.post('/auth/login', async (req: AuthenticatedRequest, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION',
        message: parseResult.error.issues[0]?.message || 'Ошибка валидации входящих данных.',
      },
    });
    return;
  }

  const { email, password } = parseResult.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Не раскрываем, что именно неверно — email или пароль
    if (!user) {
      res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Неверный email или пароль. Пожалуйста, проверьте введённые данные.',
        },
      });
      return;
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Неверный email или пароль. Пожалуйста, проверьте введённые данные.',
        },
      });
      return;
    }

    // Создание новой сессии в БД
    const sessionId = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        expiresAt,
      },
    });

    setSessionCookie(res, sessionId, expiresAt);

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Не удалось выполнить вход. Пожалуйста, повторите попытку позже.',
      },
    });
  }
});

/**
 * Выход из аккаунта
 * POST /api/auth/logout
 */
authRouter.post('/auth/logout', async (req: AuthenticatedRequest, res: Response) => {
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies[SESSION_COOKIE_NAME];

  if (sessionId) {
    try {
      await prisma.session.deleteMany({
        where: { id: sessionId },
      });
    } catch {
      // Игнорируем ошибку удаления сессии при логауте
    }
  }

  clearSessionCookie(res);
  res.status(204).end();
});

/**
 * Получение профиля текущего пользователя
 * GET /api/auth/me
 */
authRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    user: req.user,
  });
});

/**
 * Тестовый маршрут проверки ролевого доступа (403 для BUYER)
 * Регистрируется строго при NODE_ENV !== 'production'
 */
if (config.nodeEnv !== 'production') {
  authRouter.get(
    '/test/owner-only',
    requireAuth,
    requireRole('STORE_OWNER'),
    (req: AuthenticatedRequest, res: Response) => {
      res.status(200).json({
        message: 'Доступ разрешён: роль STORE_OWNER подтверждена.',
        user: req.user,
      });
    }
  );
}
