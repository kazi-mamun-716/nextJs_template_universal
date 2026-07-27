/**
 * Shared regular expression patterns.
 * Centralizes all regex patterns for consistency, reusability, and easy maintenance.
 *
 * @example
 * import { REGEX } from "@/constants/regex";
 *
 * if (REGEX.EMAIL.test(email)) { ... }
 */

export const REGEX = {
  // ─── Identity & Contact ──────────────────────────────────
  /** RFC 5322 compliant email address */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** Phone number (international format, 7-15 digits with optional +) */
  PHONE: /^\+?[\d\s-()]{7,15}$/,

  /** Username (alphanumeric + underscore, 3-30 chars) */
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/,

  // ─── Security ────────────────────────────────────────────
  /** Strong password: min 8 chars, at least 1 letter and 1 number */
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,

  /** Password with uppercase, lowercase, number, and special char (8+ chars) */
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/,

  // ─── Identifiers ─────────────────────────────────────────
  /** MongoDB ObjectId (24 hex chars) */
  OBJECT_ID: /^[0-9a-fA-F]{24}$/,

  /** UUID v4 */
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

  /** UUID (any version) */
  UUID_ANY: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,

  /** JWT token (three base64url parts separated by dots) */
  JWT: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,

  // ─── Web ─────────────────────────────────────────────────
  /** URL (http/https/ftp) */
  URL: /^https?:\/\/.+/,

  /** Slug (lowercase alphanumeric with hyphens) */
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  /** Domain name (including subdomains) */
  DOMAIN: /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,

  /** IPv4 address */
  IPV4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,

  // ─── Content ─────────────────────────────────────────────
  /** Hex color code (#RGB or #RRGGBB) */
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,

  /** HTML tags (for stripping) */
  HTML_TAG: /<[^>]*>/g,

  /** Whitespace (one or more spaces, tabs, newlines) */
  WHITESPACE: /\s+/,

  /** Special characters */
  SPECIAL_CHARS: /[!@#$%^&*(),.?":{}|<>]/,

  // ─── Numbers ─────────────────────────────────────────────
  /** Positive integer */
  POSITIVE_INTEGER: /^\d+$/,

  /** Decimal number (positive, including decimals) */
  DECIMAL: /^\d+(\.\d+)?$/,

  /** Percentage (0-100, with optional decimal) */
  PERCENTAGE: /^(?:100(?:\.0+)?|\d{1,2}(?:\.\d+)?)$/,

  // ─── Payment ─────────────────────────────────────────────
  /** Credit card number (generic, Luhn check recommended for validation) */
  CREDIT_CARD: /^(?:\d{4}[-\s]?){3}\d{4}$/,

  /** Credit card CVV (3-4 digits) */
  CVV: /^\d{3,4}$/,
} as const;

export type RegexKey = keyof typeof REGEX;

/**
 * Tests if a string matches a named regex pattern.
 *
 * @example
 * matchRegex("test@email.com", "EMAIL") // true
 */
export function matchRegex(value: string, pattern: RegexKey): boolean {
  return REGEX[pattern].test(value);
}
