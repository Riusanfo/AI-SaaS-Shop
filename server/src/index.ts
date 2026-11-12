import express, { type Request, type Response, type NextFunction } from 'express';
import { config } from './config.js';
import { prisma } from './db.js';
import { authRouter } from './routes/auth.js';
import { storeRouter } from './routes/store.js';

export const app = express();

// Отключение заголовка x-powered-by в целях безопасности
app.disable('x-powered-by');

// Лимит размера входящего JSON-тела для защиты от DoS
app.use(express.json({ limit: '100kb' }));

// Healthcheck эндпоинт с реальной проверкой доступности БД
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', db: 'up' });
  } catch {
    res.status(503).json({ status: 'error', db: 'down' });
  }
});

// Маршруты авторизации и аутентификации
app.use('/api', authRouter);

// Маршруты витрин и управления каталогом магазина
app.use('/api', storeRouter);

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
  type?: string;
}

// Единый централизованный обработчик ошибок
// Стек вызовов и внутренние детали ошибки клиенту намеренно не передаются
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  // _next обязателен в сигнатуре из 4 аргументов для регистрации обработчика ошибок Express;
  // без обращения к нему ESLint (@typescript-eslint/no-unused-vars) считает аргумент неиспользуемым
  void _next;

  const status =
    typeof err.status === 'number'
      ? err.status
      : typeof err.statusCode === 'number'
        ? err.statusCode
        : undefined;

  // Ошибки парсера тела запроса (body-parser) со статусом 4xx
  if (status && status >= 400 && status < 500 && typeof err.type === 'string') {
    if (err.type === 'entity.too.large') {
      res.status(413).json({
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Размер тела запроса превышает допустимый лимит 100 КБ.',
        },
      });
      return;
    }

    if (err.type === 'entity.parse.failed') {
      res.status(400).json({
        error: {
          code: 'VALIDATION',
          message: 'Некорректный JSON',
        },
      });
      return;
    }

    res.status(status).json({
      error: {
        code: 'BAD_REQUEST',
        message: 'Некорректный запрос.',
      },
    });
    return;
  }

  // Безопасное логирование только 5xx ошибок сервера без утечки параметров запроса и паролей
  console.error('[ServerError]', err.name);

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Произошла непредвиденная ошибка на сервере. Пожалуйста, повторите попытку позже.',
    },
  });
});

// Запуск сервера только при непосредственном вызове файла
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    // В консоль выводится только порт запуска, никаких чувствительных данных
    console.log(`Server started on port ${config.port} (${config.nodeEnv})`);
  });
}
