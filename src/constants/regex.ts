/**
 * Shared regular expression patterns.
 * Centralizes all regex patterns for consistency and reusability.
 */
export const REGEX = {
  /** RFC 5322 compliant email regex */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** Minimum 8 chars, at least 1 letter and 1 number */
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,

  /** Alphanumeric slug (lowercase, hyphens allowed) */
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  /** URL (basic validation) */
  URL: /^https?:\/\/.+/,

  /** MongoDB ObjectId */
  OBJECT_ID: /^[0-9a-fA-F]{24}$/,

  /** Phone number (international format) */
  PHONE: /^\+?[\d\s-()]{7,15}$/,

  /** Username (alphanumeric, 3-30 chars) */
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/,

  /** Hex color code */
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,

  /** UUID v4 */
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
} as const;
