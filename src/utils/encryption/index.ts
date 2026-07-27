import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

/**
 * Encryption and hashing utility functions.
 *
 * Uses bcryptjs for password hashing (pure JS, no native deps).
 * Uses Node crypto for other encryption needs.
 */

const SALT_ROUNDS = 12;

// ─── Password Hashing ───────────────────────────────────────

/**
 * Hashes a plain text password using bcrypt.
 *
 * @example
 * const hash = await hashPassword("myPassword123");
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain text password against a bcrypt hash.
 *
 * @example
 * const isValid = await comparePassword("myPassword123", hash);
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Validates password strength against configurable rules.
 *
 * @example
 * validatePasswordStrength("weak") // { valid: false, errors: ["Password must be at least 8 characters"] }
 */
export function validatePasswordStrength(
  password: string,
  options?: {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumber?: boolean;
    requireSpecialChar?: boolean;
  },
): { valid: boolean; errors: string[] } {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecialChar = false,
  } = options ?? {};

  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }
  if (password.length > maxLength) {
    errors.push(`Password must be no more than ${maxLength} characters`);
  }
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (requireNumber && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return { valid: errors.length === 0, errors };
}

// ─── Random String Generation ───────────────────────────────

/**
 * Generates a random string of specified length using crypto-safe random bytes.
 */
export function generateRandomString(length: number, charset = "abcdefghijklmnopqrstuvwxyz0123456789"): string {
  const bytes = randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[bytes[i] % charset.length];
  }
  return result;
}
