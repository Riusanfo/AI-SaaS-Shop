import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    if (name === 'DATABASE_URL') {
      throw new Error(
        'Критическая ошибка конфигурации: переменная окружения DATABASE_URL не задана.\n' +
        'Укажите строку подключения к PostgreSQL в файле server/.env (см. пример в server/.env.example).'
      );
    }
    throw new Error(`Критическая ошибка: переменная окружения ${name} не задана.`);
  }
  return value;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) {
    return secret;
  }
  if (nodeEnv === 'development' || nodeEnv === 'test') {
    // ВНИМАНИЕ: данный ключ используется исключительно для локальной разработки/тестов и НЕБЕЗОПАСЕН в продакшене
    return 'dev_insecure_session_secret_for_local_debugging_only_32bytes';
  }
  throw new Error(
    `Критическая ошибка: переменная окружения SESSION_SECRET обязательна при NODE_ENV="${nodeEnv}".`
  );
}

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv,
  databaseUrl: getRequiredEnv('DATABASE_URL'),
  sessionSecret: getSessionSecret(),
} as const;
