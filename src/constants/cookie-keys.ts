/**
 * Cookie name constants.
 * Centralizes all cookie names to prevent typos and ensure consistency.
 *
 * @example
 * import { COOKIE_KEYS } from "@/constants/cookie-keys";
 * cookies().set(COOKIE_KEYS.SESSION, token, { httpOnly: true, secure: true });
 */

export const COOKIE_KEYS = {
  // ─── Auth ────────────────────────────────────────────────
  /** Auth.js session token */
  SESSION: "next-auth.session-token",
  /** CSRF protection token */
  CSRF_TOKEN: "next-auth.csrf-token",
  /** PKCE code verifier for OAuth */
  PKCE_CODE_VERIFIER: "next-auth.pkce.code_verifier",
  /** Callback URL after login */
  CALLBACK_URL: "next-auth.callback-url",

  // ─── Session ─────────────────────────────────────────────
  /** Custom session token */
  ACCESS_TOKEN: "access_token",
  /** Refresh token for long-lived sessions */
  REFRESH_TOKEN: "refresh_token",

  // ─── Preferences ─────────────────────────────────────────
  /** User theme preference */
  THEME: "theme",
  /** User locale/language preference */
  LOCALE: "locale",
  /** User timezone */
  TIMEZONE: "timezone",

  // ─── Security ────────────────────────────────────────────
  /** Remember me flag */
  REMEMBER_ME: "remember_me",
  /** Device fingerprint */
  DEVICE_ID: "device_id",
} as const;

export type CookieKey = (typeof COOKIE_KEYS)[keyof typeof COOKIE_KEYS];

/**
 * Cookie configuration defaults for security.
 */
export const COOKIE_CONFIG = {
  /** Default max age for session cookies (7 days in seconds) */
  SESSION_MAX_AGE: 7 * 24 * 60 * 60,
  /** Default max age for persistent cookies (30 days in seconds) */
  PERSISTENT_MAX_AGE: 30 * 24 * 60 * 60,
  /** Default path */
  PATH: "/",
  /** Whether cookies should be HTTP-only */
  HTTP_ONLY: true,
  /** Whether cookies should be secure (HTTPS only) */
  SECURE: process.env.NODE_ENV === "production",
  /** SameSite attribute */
  SAME_SITE: "lax" as const,
} as const;
