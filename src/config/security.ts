/**
 * Security configuration.
 *
 * Centralizes all security settings — headers, rate limiting, CSRF, cookies, etc.
 * Individual security services import from here rather than hardcoding values.
 */
import { env } from "@/config/env";
import { featureFlags } from "@/config/features";
import {
  DEFAULT_CSP_DIRECTIVES,
  DEFAULT_HSTS_CONFIG,
  DEFAULT_PERMISSIONS_POLICY,
  RATE_LIMIT_DEFAULTS,
  CSRF_DEFAULTS,
} from "@/features/security/constants";

export const securityConfig = {
  /** Whether the security module is enabled */
  enabled: true,

  /** Security headers configuration */
  headers: {
    /** Whether to enable security headers middleware */
    enabled: true,
    /** Content-Security-Policy directives */
    csp: { ...DEFAULT_CSP_DIRECTIVES },
    /** HSTS configuration */
    hsts: { ...DEFAULT_HSTS_CONFIG },
    /** Referrer-Policy value */
    referrerPolicy: "strict-origin-when-cross-origin" as const,
    /** X-Frame-Options value */
    xFrameOptions: "DENY" as const,
    /** Permissions-Policy configuration */
    permissionsPolicy: { ...DEFAULT_PERMISSIONS_POLICY },
    /** Whether to add the X-Content-Type-Options: nosniff header */
    xContentTypeOptions: true,
    /** Whether to add X-DNS-Prefetch-Control: off header */
    xDnsPrefetchControl: true,
    /** Whether to enable cross-origin isolation headers */
    crossOriginIsolation: false,
  },

  /** Rate limiting configuration */
  rateLimit: {
    /** Whether rate limiting is enabled */
    enabled: featureFlags["rate-limiting"],
    /** General API route limits */
    api: { ...RATE_LIMIT_DEFAULTS.API },
    /** Auth route limits */
    auth: { ...RATE_LIMIT_DEFAULTS.AUTH },
    /** Login-specific limits */
    login: { ...RATE_LIMIT_DEFAULTS.LOGIN },
    /** Password reset limits */
    passwordReset: { ...RATE_LIMIT_DEFAULTS.PASSWORD_RESET },
    /** Email sending limits */
    email: { ...RATE_LIMIT_DEFAULTS.EMAIL },
    /** Upload limits */
    upload: { ...RATE_LIMIT_DEFAULTS.UPLOAD },
    /** Dashboard API limits */
    dashboard: { ...RATE_LIMIT_DEFAULTS.DASHBOARD },
    /** Whether to log rate limit hits */
    logHits: env.NODE_ENV === "development",
  },

  /** CSRF configuration */
  csrf: {
    /** Whether CSRF protection is enabled for custom API routes */
    enabled: true,
    /** Secret used to sign CSRF tokens (falls back to NEXTAUTH_SECRET) */
    secret: process.env.CSRF_SECRET ?? process.env.NEXTAUTH_SECRET,
    /** CSRF token expiry in seconds */
    expirySeconds: CSRF_DEFAULTS.EXPIRY_SECONDS,
    /** Header name for CSRF token */
    headerName: CSRF_DEFAULTS.HEADER_NAME,
    /** Cookie name for CSRF token */
    cookieName: CSRF_DEFAULTS.COOKIE_NAME,
    /** Whether to set the CSRF cookie */
    cookieEnabled: CSRF_DEFAULTS.COOKIE_ENABLED,
  },

  /** Cookie security defaults */
  cookies: {
    /** Whether to use secure cookies (HTTPS only) */
    secure: env.NODE_ENV === "production",
    /** Default SameSite attribute */
    sameSite: "lax" as const,
    /** Default HTTP-only setting */
    httpOnly: true,
    /** Default cookie path */
    path: "/",
  },

  /** Input sanitization defaults */
  sanitization: {
    /** Whether to sanitize all user input by default */
    enabled: true,
    /** Whether to strip HTML tags */
    stripHtml: true,
    /** Whether to escape remaining HTML entities */
    escapeHtml: true,
    /** Whether to detect and block SQL injection patterns */
    detectSqlInjection: true,
    /** Maximum string length for sanitized input */
    maxLength: 10000,
  },

  /** Trusted origins for CORS (in addition to the app URL) */
  trustedOrigins: [
    env.NEXT_PUBLIC_APP_URL,
  ],
};

export type SecurityConfig = typeof securityConfig;
