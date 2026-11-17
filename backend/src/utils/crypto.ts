import crypto from 'crypto';

/**
 * Generates a cryptographically strong 6-digit numeric token.
 */
export function generateSixDigitCode(): string {
  const min = 100000;
  const max = 999999;
  return crypto.randomInt(min, max + 1).toString();
}

/**
 * Calculates SHA-256 hash of (code + salt/chat_id).
 */
export function hashToken(code: string, salt: string): string {
  return crypto
    .createHash('sha256')
    .update(code.trim() + salt.trim())
    .digest('hex');
}

/**
 * Performs timing-safe comparison to prevent timing side-channel attacks on tokens.
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  return crypto.timingSafeEqual(bufA, bufB);
}
