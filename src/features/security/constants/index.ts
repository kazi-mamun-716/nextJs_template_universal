/**
 * Security module constants.
 *
 * Centralizes all security-related configuration values, defaults,
 * and lookup maps for consistent use across services.
 */
import { COOKIE_CONFIG } from "@/constants/cookie-keys";

// ─── CSP Directives ───────────────────────────────

/** Common Content-Security-Policy directive source values. */
export const CSP_SOURCES = {
  /** Allow all (use sparingly) */
  ANY: "*",
  /** Same-origin only */
  SELF: "'self'",
  /** Inline scripts/styles (for nonce-based CSP) */
  INLINE: "'unsafe-inline'",
  /** Eval (avoid if possible) */
  EVAL: "'unsafe-eval'",
  /** Strict dynamic for modern CSP */
  STRICT_DYNAMIC: "'strict-dynamic'",
  /** Allow data: URIs */
  DATA: "data:",
  /** Allow blob: URIs */
  BLOB: "blob:",
  /** Allow HTTPS schemes */
  HTTPS: "https:",
  /** Allow none */
  NONE: "'none'",
  /** Report only mode */
  REPORT_SAMPLE: "'report-sample'",
  /** Nonce placeholder – replace with actual nonce at runtime */
  NONCE: "'nonce-{nonce}'",
} as const;

/** Default CSP directives for a modern web application. */
export const DEFAULT_CSP_DIRECTIVES = {
  defaultSrc: [CSP_SOURCES.SELF],
  scriptSrc: [CSP_SOURCES.SELF],
  styleSrc: [CSP_SOURCES.SELF, CSP_SOURCES.INLINE],
  imgSrc: [CSP_SOURCES.SELF, CSP_SOURCES.DATA, CSP_SOURCES.BLOB, "https://res.cloudinary.com"],
  connectSrc: [CSP_SOURCES.SELF],
  fontSrc: [CSP_SOURCES.SELF],
  objectSrc: [CSP_SOURCES.NONE],
  mediaSrc: [CSP_SOURCES.SELF],
  frameSrc: [CSP_SOURCES.SELF],
  frameAncestors: [CSP_SOURCES.NONE],
  baseUri: [CSP_SOURCES.SELF],
  formAction: [CSP_SOURCES.SELF],
  manifestSrc: [CSP_SOURCES.SELF],
  workerSrc: [CSP_SOURCES.SELF],
  strictDynamic: false,
  upgradeInsecureRequests: true,
  reportUri: undefined,
} as const;

// ─── Security Header Names ───────────────────────

/** Standard security header names. */
export const HEADER_NAMES = {
  CONTENT_SECURITY_POLICY: "Content-Security-Policy",
  CONTENT_SECURITY_POLICY_REPORT_ONLY: "Content-Security-Policy-Report-Only",
  STRICT_TRANSPORT_SECURITY: "Strict-Transport-Security",
  X_CONTENT_TYPE_OPTIONS: "X-Content-Type-Options",
  X_FRAME_OPTIONS: "X-Frame-Options",
  X_XSS_PROTECTION: "X-XSS-Protection",
  REFERRER_POLICY: "Referrer-Policy",
  PERMISSIONS_POLICY: "Permissions-Policy",
  X_DNS_PREFETCH_CONTROL: "X-DNS-Prefetch-Control",
  CROSS_ORIGIN_EMBEDDER_POLICY: "Cross-Origin-Embedder-Policy",
  CROSS_ORIGIN_OPENER_POLICY: "Cross-Origin-Opener-Policy",
  CROSS_ORIGIN_RESOURCE_POLICY: "Cross-Origin-Resource-Policy",
  CACHE_CONTROL: "Cache-Control",
  CLEAR_SITE_DATA: "Clear-Site-Data",
} as const;

/** Header values for common security configurations. */
export const HEADER_VALUES = {
  /** Deny framing entirely */
  X_FRAME_OPTIONS_DENY: "DENY",
  /** Allow framing from same origin */
  X_FRAME_OPTIONS_SAMEORIGIN: "SAMEORIGIN",
  /** No sniffing content type */
  X_CONTENT_TYPE_OPTIONS_NOSNIFF: "nosniff",
  /** Disable XSS filter (modern browsers disable it anyway) */
  X_XSS_PROTECTION_DISABLED: "0",
  /** Block XSS filter */
  X_XSS_PROTECTION_BLOCK: "1; mode=block",
  /** Strict origin when cross-origin */
  REFERRER_POLICY_STRICT: "strict-origin-when-cross-origin",
  /** No referrer */
  REFERRER_POLICY_NO_REFERRER: "no-referrer",
  /** Same-origin referrer */
  REFERRER_POLICY_SAME_ORIGIN: "same-origin",
  /** DNS prefetch enabled */
  DNS_PREFETCH_ON: "on",
  /** DNS prefetch disabled */
  DNS_PREFETCH_OFF: "off",
  /** Embedder policy: require corp */
  COEP_REQUIRE_CORP: "require-corp",
  /** Embedder policy: unsafe none */
  COEP_UNSAFE_NONE: "unsafe-none",
  /** Opener policy: same origin */
  COOP_SAME_ORIGIN: "same-origin",
  /** Opener policy: same origin allow popups */
  COOP_SAME_ORIGIN_ALLOW_POPUPS: "same-origin-allow-popups",
  /** Resource policy: same origin */
  CORP_SAME_ORIGIN: "same-origin",
  /** Resource policy: same site */
  CORP_SAME_SITE: "same-site",
  /** No cache for sensitive data */
  CACHE_NO_STORE: "no-store",
  /** No sniffing cache */
  CACHE_NO_CACHE: "no-cache, no-store, must-revalidate",
} as const;

// ─── Permissions Policy Defaults ──────────────────

/** Default Permissions-Policy values (all restricted by default). */
export const DEFAULT_PERMISSIONS_POLICY = {
  camera: "none",
  microphone: "none",
  geolocation: "none",
  notifications: "none",
  payment: "none",
  clipboardRead: "self",
  clipboardWrite: "self",
  fullscreen: "self",
  usb: "none",
  bluetooth: "none",
  midi: "none",
  displayCapture: "self",
  accelerometer: "none",
  gyroscope: "none",
  magnetometer: "none",
  ambientLightSensor: "none",
  crossOriginIsolated: "self",
  encryptedMedia: "self",
  pictureInPicture: "self",
  screenWakeLock: "none",
  publickeyCredentials: "self",
  localFonts: "none",
  syncXhr: "none",
  webShare: "self",
} as const;

// ─── HSTS Defaults ────────────────────────────────

/** Default HSTS configuration. */
export const DEFAULT_HSTS_CONFIG = {
  /** 1 year in seconds */
  maxAge: 31536000,
  includeSubDomains: true,
  preload: false,
} as const;

// ─── Rate Limit Defaults ─────────────────────────

/** Default rate limit configurations for different contexts. */
export const RATE_LIMIT_DEFAULTS = {
  /** General API rate limiting (100 requests per minute) */
  API: { max: 100, windowMs: 60 * 1000 },
  /** Auth endpoints (10 requests per minute) */
  AUTH: { max: 10, windowMs: 60 * 1000 },
  /** Login attempts (5 per minute) */
  LOGIN: { max: 5, windowMs: 60 * 1000 },
  /** Password reset (3 per hour) */
  PASSWORD_RESET: { max: 3, windowMs: 60 * 60 * 1000 },
  /** Email sending (30 per minute) */
  EMAIL: { max: 30, windowMs: 60 * 1000 },
  /** File uploads (10 per minute) */
  UPLOAD: { max: 10, windowMs: 60 * 1000 },
  /** Dashboard API (200 requests per minute) */
  DASHBOARD: { max: 200, windowMs: 60 * 1000 },
} as const;

/** Rate limit key prefixes for Redis/Map store. */
export const RATE_LIMIT_KEY_PREFIXES = {
  API: "rl:api:",
  AUTH: "rl:auth:",
  LOGIN: "rl:login:",
  EMAIL: "rl:email:",
  UPLOAD: "rl:upload:",
  DASHBOARD: "rl:dashboard:",
} as const;

// ─── CSRF Defaults ────────────────────────────────

/** Default CSRF configuration. */
export const CSRF_DEFAULTS = {
  /** Token expiry in seconds (1 hour) */
  EXPIRY_SECONDS: 3600,
  /** Header name for CSRF token */
  HEADER_NAME: "x-csrf-token",
  /** Cookie name for CSRF token */
  COOKIE_NAME: "__Host-csrf-token",
  /** Whether CSRF cookie is enabled */
  COOKIE_ENABLED: true,
} as const;

/** HTTP methods that require CSRF protection. */
export const CSRF_PROTECTED_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// ─── Cookie Defaults ─────────────────────────────

/** Application cookie configuration derived from base constants. */
export const SECURE_COOKIE_DEFAULTS = {
  path: COOKIE_CONFIG.PATH,
  httpOnly: COOKIE_CONFIG.HTTP_ONLY,
  secure: COOKIE_CONFIG.SECURE,
  sameSite: COOKIE_CONFIG.SAME_SITE as "strict" | "lax" | "none",
  sessionMaxAge: COOKIE_CONFIG.SESSION_MAX_AGE,
  persistentMaxAge: COOKIE_CONFIG.PERSISTENT_MAX_AGE,
} as const;

// ─── Sanitization Defaults ───────────────────────

/** Default sanitization options. */
export const DEFAULT_SANITIZE_OPTIONS = {
  stripHtml: false,
  escapeHtml: true,
  trim: true,
  normalizeWhitespace: true,
  removeNonAscii: false,
  maxLength: undefined,
  removeScripts: true,
} as const;

/** HTML tags that are considered safe when stripping is disabled. */
export const SAFE_HTML_TAGS = new Set([
  "p", "br", "b", "i", "em", "strong", "a", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "code",
  "span", "div", "table", "thead", "tbody", "tr", "th", "td",
  "hr", "sub", "sup", "img", "figure", "figcaption",
]);

/** HTML attributes that are considered safe. */
export const SAFE_HTML_ATTRIBUTES = new Set([
  "href", "title", "alt", "src", "width", "height", "class",
  "id", "target", "rel", "lang", "dir", "style",
]);

/** SQL injection patterns to detect and neutralize. */
export const SQL_INJECTION_PATTERNS = [
  /(\bSELECT\b.*\bFROM\b)/i,
  /(\bDROP\b\s+\bTABLE\b)/i,
  /(\bDELETE\b\s+\bFROM\b)/i,
  /(\bINSERT\b\s+\bINTO\b)/i,
  /(\bUPDATE\b\s+\w+\s+\bSET\b)/i,
  /(\bEXEC\b|\bEXECUTE\b)/i,
  /(\bUNION\b\s+\bSELECT\b)/i,
  /(\bALTER\b\s+\bTABLE\b)/i,
  /(\bCREATE\b\s+\bTABLE\b)/i,
  /(\bTRUNCATE\b\s+\bTABLE\b)/i,
  /('?\s*OR\s+\d+\s*=\s*\d+\s*--?)/i,
  /('?\s*OR\s+['\"]\w+['\"]\s*=\s*['\"]\w+['\"]\s*--?)/i,
];

// ─── Security Error Codes ───────────────────────

/** Error codes for security-related errors. */
export const SECURITY_ERROR_CODES = {
  CSRF_INVALID: "CSRF_INVALID_TOKEN",
  CSRF_MISSING: "CSRF_MISSING_TOKEN",
  CSRF_EXPIRED: "CSRF_TOKEN_EXPIRED",
  RATE_LIMITED: "RATE_LIMITED",
  INVALID_ORIGIN: "INVALID_ORIGIN",
  SUSPICIOUS_INPUT: "SUSPICIOUS_INPUT_DETECTED",
  BLOCKED_IP: "IP_BLOCKED",
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  SANITIZATION_FAILED: "SANITIZATION_FAILED",
} as const;
