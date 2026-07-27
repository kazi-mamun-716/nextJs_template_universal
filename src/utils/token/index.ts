import { randomBytes, createHash, timingSafeEqual } from "crypto";

/**
 * Token generation and management utilities.
 */

/**
 * Generates a cryptographically secure random token (hex-encoded).
 *
 * @example
 * generateToken() // "a1b2c3d4e5f6..."
 * generateToken(16) // "a1b2c3d4e5f6a7b8"
 */
export function generateToken(length = 32): string {
  return randomBytes(length).toString("hex");
}

/**
 * Generates a URL-safe base64 token.
 *
 * @example
 * generateBase64Token(32) // "a1b2-c3d4_e5f6..." (URL-safe)
 */
export function generateBase64Token(bytes = 32): string {
  return randomBytes(bytes)
    .toString("base64url");
}

/**
 * Generates a short numeric OTP code.
 *
 * @example
 * generateOTP() // "482915"
 * generateOTP(4) // "7301"
 */
export function generateOTP(length = 6): string {
  const digits = "0123456789";
  let otp = "";
  const bytes = randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[bytes[i] % 10];
  }
  return otp;
}

/**
 * Generates an alphanumeric token (no special characters).
 *
 * @example
 * generateAlphanumericToken(12) // "kH9mP2qR5sT7"
 */
export function generateAlphanumericToken(length = 24): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  const bytes = randomBytes(length);
  for (let i = 0; i < length; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}

/**
 * Creates a SHA-256 hash of a token (for storage, never store raw tokens).
 *
 * @example
 * hashToken("raw-token") // "5e884898da280471..."
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Compares two tokens using timing-safe comparison (prevents timing attacks).
 *
 * @example
 * compareTokens("token-from-db", "token-from-user") // true/false
 */
export function compareTokens(knownToken: string, userToken: string): boolean {
  try {
    const knownBuf = Buffer.from(knownToken);
    const userBuf = Buffer.from(userToken);
    if (knownBuf.length !== userBuf.length) return false;
    return timingSafeEqual(knownBuf, userBuf);
  } catch {
    return false;
  }
}

/**
 * Creates a token with expiry metadata.
 *
 * @example
 * createTokenWithExpiry() // { token: "...", expiresAt: Date }
 * createTokenWithExpiry(3600000) // expires in 1 hour
 */
export function createTokenWithExpiry(expiresInMs = 24 * 60 * 60 * 1000): {
  token: string;
  hashedToken: string;
  expiresAt: Date;
} {
  const token = generateToken();
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + expiresInMs);

  return { token, hashedToken, expiresAt };
}

/**
 * Checks if a date has expired.
 *
 * @example
 * isExpired(new Date(Date.now() - 1000)) // true
 */
export function isExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
