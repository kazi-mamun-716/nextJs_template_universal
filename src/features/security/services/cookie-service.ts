/**
 * Secure cookie service.
 *
 * Provides consistent, secure cookie operations using the
 * project-wide security configuration. All cookies are set with
 * secure defaults (httpOnly, secure, sameSite) unless overridden.
 *
 * Designed for use in Server Actions and Route Handlers where
 * the Next.js `cookies()` API is available.
 *
 * @example
 * // In a Server Action or Route Handler
 * import { cookies } from "next/headers";
 * import { cookieService } from "@/features/security/services/cookie-service";
 *
 * // Set a session token
 * await cookieService.set(cookies(), {
 *   name: "access_token",
 *   value: token,
 *   maxAge: 60 * 60, // 1 hour
 * });
 *
 * // Get a cookie
 * const token = await cookieService.get(cookies(), "access_token");
 *
 * // Clear a cookie
 * await cookieService.clear(cookies(), "access_token");
 */

import { securityConfig } from "@/config/security";
import { COOKIE_KEYS, type CookieKey } from "@/constants/cookie-keys";
import { SECURE_COOKIE_DEFAULTS } from "@/features/security/constants";
import type { SecureCookieOptions } from "@/features/security/types";

// ─── Types ───────────────────────────────────────

/**
 * Minimal cookies API interface.
 *
 * Compatible with both `next/headers` cookies() return value
 * and Next.js Response cookies API.
 */
interface CookiesLike {
  set(name: string, value: string, options?: Record<string, unknown>): void;
  get(name: string): { name: string; value: string } | undefined;
  delete(name: string): void;
}

// ─── Service ─────────────────────────────────────

export const cookieService = {
  /**
   * Sets a cookie with secure defaults.
   *
   * @param cookiesApi - The cookies API from `next/headers` or a Response
   * @param options - Cookie options including name, value, and optional overrides
   *
   * @example
   * await cookieService.set(cookies(), {
   *   name: COOKIE_KEYS.ACCESS_TOKEN,
   *   value: "eyJhbGci...",
   *   maxAge: 3600,
   * });
   */
  set(cookiesApi: CookiesLike, options: SecureCookieOptions): void {
    const { name, value, ...overrides } = options;

    cookiesApi.set(name, value, {
      path: overrides.path ?? SECURE_COOKIE_DEFAULTS.path,
      httpOnly: overrides.httpOnly ?? SECURE_COOKIE_DEFAULTS.httpOnly,
      secure: overrides.secure ?? SECURE_COOKIE_DEFAULTS.secure,
      sameSite: overrides.sameSite ?? SECURE_COOKIE_DEFAULTS.sameSite,
      maxAge: overrides.maxAge,
      domain: overrides.domain,
      expires: overrides.expires,
    });
  },

  /**
   * Gets the value of a cookie.
   *
   * @param cookiesApi - The cookies API from `next/headers`
   * @param name - Cookie name (from COOKIE_KEYS or custom string)
   * @returns The cookie value, or null if not found
   *
   * @example
   * const token = await cookieService.get(cookies(), COOKIE_KEYS.ACCESS_TOKEN);
   */
  get(cookiesApi: CookiesLike, name: CookieKey | string): string | null {
    const cookie = cookiesApi.get(name);
    return cookie?.value ?? null;
  },

  /**
   * Deletes a cookie by name.
   *
   * @param cookiesApi - The cookies API from `next/headers` or a Response
   * @param name - Cookie name to delete
   *
   * @example
   * await cookieService.clear(cookies(), COOKIE_KEYS.SESSION);
   */
  clear(cookiesApi: CookiesLike, name: CookieKey | string): void {
    cookiesApi.delete(name);
  },

  /**
   * Sets a session cookie (short-lived, typically 7 days).
   *
   * @param cookiesApi - The cookies API
   * @param name - Cookie name
   * @param value - Cookie value
   */
  setSession(cookiesApi: CookiesLike, name: CookieKey | string, value: string): void {
    this.set(cookiesApi, {
      name,
      value,
      maxAge: SECURE_COOKIE_DEFAULTS.sessionMaxAge,
    });
  },

  /**
   * Sets a persistent cookie (long-lived, typically 30 days).
   * Useful for "Remember Me" functionality.
   *
   * @param cookiesApi - The cookies API
   * @param name - Cookie name
   * @param value - Cookie value
   */
  setPersistent(cookiesApi: CookiesLike, name: CookieKey | string, value: string): void {
    this.set(cookiesApi, {
      name,
      value,
      maxAge: SECURE_COOKIE_DEFAULTS.persistentMaxAge,
    });
  },

  /**
   * Clears all known application cookies.
   * Useful for logout operations.
   *
   * @param cookiesApi - The cookies API
   *
   * @example
   * await cookieService.clearAll(cookies());
   */
  clearAll(cookiesApi: CookiesLike): void {
    const allKeys = Object.values(COOKIE_KEYS);
    for (const key of allKeys) {
      this.clear(cookiesApi, key);
    }
  },
};
