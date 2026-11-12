import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';

// Константы параметров scrypt
export const SCRYPT_N = 16384;   // Cost factor (CPU/memory cost)
export const SCRYPT_R = 8;       // Block size
export const SCRYPT_P = 1;       // Parallelization factor
export const SCRYPT_KEYLEN = 64; // Длина итогового ключа в байтах
export const SALT_BYTES = 16;    // Длина случайной соли на пользователя

function deriveScryptKey(
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number }
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey);
    });
  });
}

/**
 * Хеширует пароль с использованием scrypt и уникальной соли 16 байт
 * @returns Строка вида "saltHex:hashHex"
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derivedKey = await deriveScryptKey(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });

  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

/**
 * Проверяет пароль на соответствие сохранённому хешу.
 * Выполняет ранний выход при неверном формате строки (отсутствие ':', неверная длина соли или хеша).
 * При валидном формате вычисляет хеш от переданного пароля и сравнивает его через timingSafeEqual.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(':');
  if (parts.length !== 2) {
    return false;
  }

  const [saltHex, expectedHashHex] = parts;
  const salt = Buffer.from(saltHex, 'hex');
  const expectedHash = Buffer.from(expectedHashHex, 'hex');

  if (salt.length !== SALT_BYTES || expectedHash.length !== SCRYPT_KEYLEN) {
    return false;
  }

  const calculatedHash = await deriveScryptKey(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });

  return timingSafeEqual(calculatedHash, expectedHash);
}
