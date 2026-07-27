/**
 * Security validation service.
 *
 * Provides pre-validation and sanitization wrappers around Zod schemas.
 * Ensures input is sanitized before Zod validation, and validates
 * security-specific concerns like origin checking and IP validation.
 *
 * @example
 * import { securityValidation } from "@/features/security/services/validation";
 * import { fields } from "@/lib/validation/fields";
 * import { z } from "zod";
 *
 * // Sanitize before Zod validation
 * const schema = z.object({ name: fields.name() });
 * const result = await securityValidation.sanitizeAndValidate(schema, rawInput);
 */

import { z } from "zod";
import { securityConfig } from "@/config/security";
import { sanitizer } from "@/features/security/services/sanitizer";
import type { ValidationResult } from "@/features/security/types";

// ─── Origin Validation ──────────────────────────

/**
 * Checks if a given origin is in the configured trusted origins list.
 *
 * @param origin - The origin to check
 * @returns True if the origin is trusted
 *
 * @example
 * if (securityValidation.isTrustedOrigin(request.headers.get("origin"))) {
 *   // Allow CORS
 * }
 */
export function isTrustedOrigin(origin: string | null): boolean {
  if (!origin) {
    return false;
  }

  return securityConfig.trustedOrigins.some((trusted) => {
    if (trusted === "*") return true;
    return origin.toLowerCase() === trusted.toLowerCase();
  });
}

/**
 * Validates that a request's origin matches the expected app URL.
 * Returns null if valid, or an error message if invalid.
 *
 * @param origin - The Origin header value
 * @returns Error message or null
 */
export function validateOrigin(origin: string | null): string | null {
  if (!origin) {
    return null; // Some requests (like server-to-server) don't have an Origin header
  }

  if (!isTrustedOrigin(origin)) {
    return `Origin "${origin}" is not allowed`;
  }

  return null;
}

// ─── IP Validation ──────────────────────────────

/** Regex pattern for valid IPv4 addresses. */
const IPV4_PATTERN = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

/** Regex pattern for valid IPv6 addresses (simplified). */
const IPV6_PATTERN = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

/**
 * Checks if a string is a valid IP address (v4 or v6).
 *
 * @param ip - The IP address to validate
 * @returns True if valid
 */
export function isValidIp(ip: string): boolean {
  return IPV4_PATTERN.test(ip) || IPV6_PATTERN.test(ip);
}

/**
 * Checks if an IP address is in a private/reserved range.
 *
 * @param ip - The IP address to check
 * @returns True if the IP is private
 */
export function isPrivateIp(ip: string): boolean {
  if (IPV4_PATTERN.test(ip)) {
    const parts = ip.split(".").map(Number);
    return (
      parts[0] === 10 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      parts[0] === 127 ||
      parts[0] === 0
    );
  }
  return false;
}

// ─── Sanitize + Validate ───────────────────────

/**
 * Sanitizes raw input and validates it against a Zod schema.
 *
 * Useful for Server Actions and API routes where raw form data
 * or JSON body needs to be sanitized before validation.
 *
 * @param schema - Zod schema to validate against
 * @param rawInput - Raw input data (will be sanitized first)
 * @param options - Optional sanitization options
 * @returns ValidationResult with sanitized data or field errors
 *
 * @example
 * const result = await securityValidation.sanitizeAndValidate(
 *   z.object({ name: z.string() }),
 *   { name: "<script>alert('xss')</script>John" }
 * );
 *
 * if (result.success) {
 *   const { name } = result.data; // "John" (sanitized)
 * }
 */
export async function sanitizeAndValidate<T>(
  schema: z.ZodSchema<T>,
  rawInput: unknown,
  options?: { sanitize?: boolean },
): Promise<ValidationResult<T>> {
  // Sanitize the input
  let input = rawInput;
  if (options?.sanitize !== false) {
    input = sanitizer.deepSanitize(rawInput, {
      skipKeys: ["password", "currentPassword", "newPassword", "confirmPassword", "token", "secret"],
    });
  }

  // Validate against schema
  const result = schema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Build field errors
  const errors: Record<string, string[]> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".") || "_form";
    if (!errors[path]) errors[path] = [];
    errors[path].push(issue.message);
  }

  return {
    success: false,
    errors,
    message: "Validation failed. Please check your input.",
  };
}

// ─── Security Validation Container ─────────────

export const securityValidation = {
  isTrustedOrigin,
  validateOrigin,
  isValidIp,
  isPrivateIp,
  sanitizeAndValidate,
};
