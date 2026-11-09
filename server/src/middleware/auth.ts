import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db.js';
import { config } from '../config.js';
import type { Role, UserSummary } from '../types.js';

export const SESSION_COOKIE_NAME = 'shop_session_id';
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 дней

export interface AuthenticatedRequest extends Request {
  user?: UserSummary;
  sessionId?: string;
}

/**
 * Читает cookie из строки заголовка req.headers.cookie без внешних зависимостей
 */
export function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  const pairs = cookieHeader.split(';');

  for (const pair of pairs) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) continue;
    const key = pair.slice(0, eqIdx).trim();
    const rawVal = pair.slice(eqIdx + 1).trim();
    if (key) {
      try {
        cookies[key] = decodeURIComponent(rawVal);
      } catch {
        cookies[key] = rawVal;
      }
    }
  }

  return cookies;
}

/**
 * Устанавливает HTTP-only cookie сессии с правильными флагами безопасности
 */
export function setSessionCookie(res: Response, sessionId: string, expiresAt: Date): void {
  const isProd = config.nodeEnv === 'production';
  const cookieParts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}`,
    'Path=/',
    `Expires=${expiresAt.toUTCString()}`,
    'HttpOnly',
    'SameSite=Lax',
  ];

  if (isProd) {
    cookieParts.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

/**
 * Очищает cookie сессии
 */
export function clearSessionCookie(res: Response): void {
  const isProd = config.nodeEnv === 'production';
  const cookieParts = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'HttpOnly',
    'SameSite=Lax',
  ];

  if (isProd) {
    cookieParts.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

/**
 * Middleware аутентификации: проверяет наличие и валидность сессии в БД
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies[SESSION_COOKIE_NAME];

  if (!sessionId) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Требуется авторизация. Пожалуйста, выполните вход в систему.',
      },
    });
    return;
  }

  try {
    // Получение сессии и пользователя за 1 оптимизированный запрос к БД
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || session.expiresAt <= new Date()) {
      if (session) {
        // Удаление просроченной сессии в фоне
        prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
      }
      clearSessionCookie(res);
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Сессия истекла или недействительна. Пожалуйста, выполните вход повторно.',
        },
      });
      return;
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role as Role,
    };
    req.sessionId = session.id;

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Middleware авторизации по роли: проверяет соответствие роли пользователя
 * ВАЖНО: роль всегда берется из БД по сессии (через requireAuth), а не из тела запроса или cookie!
 *
 * Пример использования в маршрутах:
 * router.get('/admin', requireAuth, requireRole('PLATFORM_ADMIN'), adminHandler);
 * router.post('/stores', requireAuth, requireRole('STORE_OWNER'), createStoreHandler);
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Требуется авторизация для проверки прав доступа.',
        },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Недостаточно прав для выполнения данной операции.',
        },
      });
      return;
    }

    next();
  };
}
