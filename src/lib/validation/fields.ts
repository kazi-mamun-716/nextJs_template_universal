/**
 * Reusable Zod field schemas.
 *
 * Provides pre-configured field validators that use the shared REGEX and MESSAGES constants.
 * Feature schemas should compose these fields instead of redefining common patterns.
 *
 * @example
 * import { fields } from "@/lib/validation/fields";
 *
 * export const mySchema = z.object({
 *   email: fields.email(),
 *   password: fields.password(),
 * });
 */

import { z } from "zod";
import { REGEX } from "@/constants/regex";
import { MESSAGES } from "@/constants/messages";

// ─── String Fields ────────────────────────────────

/** Email field — required, validated against REGEX.EMAIL. */
export function email(required = true) {
  if (required) {
    return z.string().min(1, MESSAGES.VALIDATION.REQUIRED).regex(REGEX.EMAIL, MESSAGES.VALIDATION.INVALID_EMAIL);
  }
  return z.string().regex(REGEX.EMAIL, MESSAGES.VALIDATION.INVALID_EMAIL).optional();
}

/** Optional email field (accepts empty string). */
export function optionalEmail() {
  return z.string().regex(REGEX.EMAIL, MESSAGES.VALIDATION.INVALID_EMAIL).optional().or(z.literal(""));
}

/** Name field — 2-100 chars, trimmed. */
export function name(min = 2, max = 100) {
  return z
    .string()
    .min(min, `Name must be at least ${min} characters`)
    .max(max, `Name must not exceed ${max} characters`);
}

/** Optional name field. */
export function optionalName(min = 2, max = 100) {
  return name(min, max).optional();
}

/** Password field — 8-128 chars. */
export function password(min = 8, max = 128) {
  return z
    .string()
    .min(min, MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH)
    .max(max, MESSAGES.VALIDATION.PASSWORD_MAX_LENGTH);
}

// ─── Web Fields ────────────────────────────────────

/** URL field — validated with Zod's built-in url(). */
export function url(required = false) {
  if (required) {
    return z.string().min(1, MESSAGES.VALIDATION.REQUIRED).url(MESSAGES.VALIDATION.INVALID_URL);
  }
  return z.string().url(MESSAGES.VALIDATION.INVALID_URL).optional().or(z.literal(""));
}

/** Slug field — lowercase alphanumeric with hyphens. */
export function slug() {
  return z.string().regex(REGEX.SLUG, MESSAGES.VALIDATION.INVALID_SLUG);
}

/** Phone field — international format. */
export function phone(required = false) {
  if (required) {
    return z.string().min(1, MESSAGES.VALIDATION.REQUIRED).regex(REGEX.PHONE, MESSAGES.VALIDATION.INVALID_PHONE);
  }
  return z.string().regex(REGEX.PHONE, MESSAGES.VALIDATION.INVALID_PHONE).optional().or(z.literal(""));
}

// ─── Identifier Fields ─────────────────────────────

/** MongoDB ObjectId — 24 hex chars. */
export function objectId() {
  return z.string().regex(REGEX.OBJECT_ID, "Invalid ID format");
}

/** UUID v4 field. */
export function uuid() {
  return z.string().regex(REGEX.UUID, "Invalid UUID format");
}

/** Token field (for verification/reset tokens). */
export function token() {
  return z.string().min(1, MESSAGES.VALIDATION.REQUIRED);
}

// ─── Numeric Fields ────────────────────────────────

/** Positive integer (parsed from string or number). */
export function positiveInt(min = 1, max = Number.MAX_SAFE_INTEGER) {
  return z
    .number()
    .int()
    .min(min, `Value must be at least ${min}`)
    .max(max, `Value must not exceed ${max}`);
}

/** Page number for pagination (default 1, min 1). */
export function pageNumber() {
  return z.coerce.number().int().min(1).default(1);
}

/** Page size for pagination (default 10, 1-100). */
export function pageSize(min = 1, max = 100) {
  return z.coerce.number().int().min(min).max(max).default(10);
}

// ─── Boolean Fields ────────────────────────────────

/** Checkbox/boolean field with default. */
export function booleanField(defaultValue = false) {
  return z.boolean().default(defaultValue);
}

// ─── Date Fields ───────────────────────────────────

/** ISO date string. */
export function isoDate(required = false) {
  if (required) {
    return z.string().min(1, MESSAGES.VALIDATION.REQUIRED).refine(
      (val) => !isNaN(Date.parse(val)),
      { message: MESSAGES.VALIDATION.INVALID_DATE },
    );
  }
  return z.string().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    { message: MESSAGES.VALIDATION.INVALID_DATE },
  ).optional().or(z.literal(""));
}

/** Date object. */
export function dateObject(required = false) {
  if (required) {
    return z.date();
  }
  return z.date().optional().nullable();
}

// ─── Enum Helpers ──────────────────────────────────

/**
 * Create a zod enum from a const object's values.
 *
 * @example
 * const Roles = { ADMIN: "admin", USER: "user" } as const;
 * const roleSchema = enumFromValues(Roles);
 */
export function enumFromValues<T extends Record<string, string>>(obj: T): z.ZodEnum<[T[keyof T], ...T[keyof T][]]> {
  const values = Object.values(obj) as [T[keyof T], ...T[keyof T][]];
  return z.enum(values);
}

/**
 * Create an optional enum from a const object's values with a default.
 */
export function enumFromValuesWithDefault<T extends Record<string, string>>(
  obj: T,
  defaultKey: keyof T,
): z.ZodDefault<z.ZodEnum<[T[keyof T], ...T[keyof T][]]>> {
  return enumFromValues(obj).default(obj[defaultKey]);
}

// ─── File Fields ───────────────────────────────────

/** File field with size and type validation. */
export function file(options: {
  maxSize?: number;
  allowedTypes?: string[];
} = {}) {
  const maxSize = options.maxSize;
  const allowedTypes = options.allowedTypes;

  let field = z.instanceof(File).refine((file) => file.size > 0, "File cannot be empty");

  if (maxSize) {
    field = field.refine(
      (file) => file.size <= maxSize,
      `File must not exceed ${maxSize / 1024 / 1024}MB`,
    );
  }

  if (allowedTypes && allowedTypes.length > 0) {
    field = field.refine(
      (file) => allowedTypes.includes(file.type),
      `File type not supported. Allowed: ${allowedTypes.join(", ")}`,
    );
  }

  return field;
}

// ─── Container ─────────────────────────────────────

/**
 * Convenience object grouping all field builders.
 *
 * @example
 * import { fields } from "@/lib/validation";
 *
 * const schema = z.object({
 *   email: fields.email(),
 *   password: fields.password(),
 *   name: fields.name(),
 * });
 */
export const fields = {
  email,
  optionalEmail,
  name,
  optionalName,
  password,
  url,
  slug,
  phone,
  objectId,
  uuid,
  token,
  positiveInt,
  pageNumber,
  pageSize,
  boolean: booleanField,
  isoDate,
  dateObject,
  enumFromValues,
  enumFromValuesWithDefault,
  file,
} as const;
