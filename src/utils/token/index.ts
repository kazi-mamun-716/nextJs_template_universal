import { randomBytes } from "crypto";

/**
 * Token generation utility functions.
 */

/**
 * Generates a cryptographically secure random token.
 */
export function generateToken(length = 32): string {
  return randomBytes(length).toString("hex");
}

/**
 * Generates a short numeric OTP code.
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
