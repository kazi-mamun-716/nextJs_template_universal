/**
 * Security module barrel export.
 *
 * @example
 * import { csrf, rateLimiter, sanitizer } from "@/features/security";
 * import type { SecurityHeaders, RateLimitResult } from "@/features/security";
 */

// ─── Services ─────────────────────────────────────

export { buildSecurityHeaders, buildCSP, buildHSTS, buildPermissionsPolicy, securityHeadersToRecord } from "./services/security-headers";
export { csrf } from "./services/csrf";
export { rateLimiter } from "./services/rate-limiter";
export { cookieService } from "./services/cookie-service";
export { sanitizer } from "./services/sanitizer";
export { securityValidation, isTrustedOrigin, validateOrigin, isValidIp, isPrivateIp, sanitizeAndValidate } from "./services/validation";

// ─── Constants ────────────────────────────────────

export {
  HEADER_NAMES,
  HEADER_VALUES,
  CSP_SOURCES,
  DEFAULT_CSP_DIRECTIVES,
  DEFAULT_HSTS_CONFIG,
  DEFAULT_PERMISSIONS_POLICY,
  RATE_LIMIT_DEFAULTS,
  RATE_LIMIT_KEY_PREFIXES,
  CSRF_DEFAULTS,
  CSRF_PROTECTED_METHODS,
  DEFAULT_SANITIZE_OPTIONS,
  SAFE_HTML_TAGS,
  SAFE_HTML_ATTRIBUTES,
  SQL_INJECTION_PATTERNS,
  SECURITY_ERROR_CODES,
  SECURE_COOKIE_DEFAULTS,
} from "./constants";

// ─── Types ────────────────────────────────────────

export type {
  SecurityHeaders,
  CSPConfig,
  HSTSConfig,
  PermissionsPolicyConfig,
  PermissionsPolicyValue,
  RateLimitConfig,
  RateLimitResult,
  RateLimitEntry,
  RateLimitStore,
  CsrfToken,
  CsrfConfig,
  SecureCookieOptions,
  SanitizeOptions,
  DeepSanitizeOptions,
  ValidationResult,
  SecurityContext,
} from "./types";
