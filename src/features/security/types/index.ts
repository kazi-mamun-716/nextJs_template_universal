/**
 * Security module type definitions.
 *
 * Centralizes all types used across the security feature.
 */
import type { CookieKey } from "@/constants/cookie-keys";

// ─── Security Headers ─────────────────────────────

/** Content-Security-Policy directives. */
export interface CSPConfig {
  /** Default source directive */
  defaultSrc?: string[];
  /** Script source directive */
  scriptSrc?: string[];
  /** Style source directive */
  styleSrc?: string[];
  /** Image source directive */
  imgSrc?: string[];
  /** Connect source directive (fetch, XHR, WebSocket) */
  connectSrc?: string[];
  /** Font source directive */
  fontSrc?: string[];
  /** Object source directive */
  objectSrc?: string[];
  /** Media source directive */
  mediaSrc?: string[];
  /** Frame source directive */
  frameSrc?: string[];
  /** Frame ancestors directive (who can embed this page) */
  frameAncestors?: string[];
  /** Base URI directive */
  baseUri?: string[];
  /** Form action directive */
  formAction?: string[];
  /** Manifest source directive */
  manifestSrc?: string[];
  /** Worker source directive */
  workerSrc?: string[];
  /** Whether to enable the strict-dynamic fallback */
  strictDynamic?: boolean;
  /** Whether to upgrade insecure requests */
  upgradeInsecureRequests?: boolean;
  /** Report URI for CSP violations */
  reportUri?: string;
}

/** HSTS (HTTP Strict Transport Security) configuration. */
export interface HSTSConfig {
  /** Max age in seconds (default: 1 year) */
  maxAge?: number;
  /** Whether to include subdomains */
  includeSubDomains?: boolean;
  /** Whether to enable preload */
  preload?: boolean;
}

/** Permissions-Policy configuration. */
export interface PermissionsPolicyConfig {
  /** Camera access */
  camera?: PermissionsPolicyValue;
  /** Microphone access */
  microphone?: PermissionsPolicyValue;
  /** Geolocation access */
  geolocation?: PermissionsPolicyValue;
  /** Notification access */
  notifications?: PermissionsPolicyValue;
  /** Payment request API */
  payment?: PermissionsPolicyValue;
  /** Clipboard API */
  clipboardRead?: PermissionsPolicyValue;
  /** Clipboard write API */
  clipboardWrite?: PermissionsPolicyValue;
  /** Fullscreen API */
  fullscreen?: PermissionsPolicyValue;
  /** USB devices */
  usb?: PermissionsPolicyValue;
  /** Bluetooth devices */
  bluetooth?: PermissionsPolicyValue;
  /** MIDI devices */
  midi?: PermissionsPolicyValue;
  /** Camera for browsing */
  displayCapture?: PermissionsPolicyValue;
  /** Accelerometer */
  accelerometer?: PermissionsPolicyValue;
  /** Gyroscope */
  gyroscope?: PermissionsPolicyValue;
  /** Magnetometer */
  magnetometer?: PermissionsPolicyValue;
  /** Ambient light sensor */
  ambientLightSensor?: PermissionsPolicyValue;
  /** Cross-origin isolated */
  crossOriginIsolated?: PermissionsPolicyValue;
  /** Encrypted media */
  encryptedMedia?: PermissionsPolicyValue;
  /** Picture-in-picture */
  pictureInPicture?: PermissionsPolicyValue;
  /** Screen wake lock */
  screenWakeLock?: PermissionsPolicyValue;
  /** Web Authentication API */
  publickeyCredentials?: PermissionsPolicyValue;
  /** Local font access */
  localFonts?: PermissionsPolicyValue;
  /** Submit events */
  syncXhr?: PermissionsPolicyValue;
  /** Web Share API */
  webShare?: PermissionsPolicyValue;
}

/** Permission policy value: '*' (allow all), 'self', 'none', or specific origins. */
export type PermissionsPolicyValue = "*" | "self" | "none" | string[];

/** Complete security headers object. */
export interface SecurityHeaders {
  /** Content-Security-Policy header */
  contentSecurityPolicy?: string;
  /** Strict-Transport-Security header */
  strictTransportSecurity?: string;
  /** X-Content-Type-Options header */
  xContentTypeOptions?: string;
  /** X-Frame-Options header */
  xFrameOptions?: string;
  /** Referrer-Policy header */
  referrerPolicy?: string;
  /** Permissions-Policy header */
  permissionsPolicy?: string;
  /** X-DNS-Prefetch-Control header */
  xDnsPrefetchControl?: string;
  /** Cross-Origin-Embedder-Policy header */
  crossOriginEmbedderPolicy?: string;
  /** Cross-Origin-Opener-Policy header */
  crossOriginOpenerPolicy?: string;
  /** Cross-Origin-Resource-Policy header */
  crossOriginResourcePolicy?: string;
  /** Cache-Control header for sensitive responses */
  cacheControl?: string;
  /** Clear-Site-Data header */
  clearSiteData?: string;
}

// ─── Rate Limiting ────────────────────────────────

/** A single rate limit entry tracking request timestamps. */
export interface RateLimitEntry {
  /** Array of request timestamps (Unix ms) */
  timestamps: number[];
  /** When this entry was first created */
  createdAt: number;
}

/** Rate limiter configuration. */
export interface RateLimitConfig {
  /** Maximum number of requests allowed */
  max: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Rate limiter identifier key prefix */
  keyPrefix?: string;
  /** Error message when limit is exceeded */
  message?: string;
}

/** Rate limiter check result. */
export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Remaining requests in the current window */
  remaining: number;
  /** Time until the rate limit resets (Unix ms) */
  resetTime: number;
  /** Total requests attempted in the current window */
  total: number;
  /** Rate limit config applied */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

/** Map storing rate limit entries, keyed by identifier. */
export type RateLimitStore = Map<string, RateLimitEntry>;

// ─── CSRF ─────────────────────────────────────────

/** CSRF token data. */
export interface CsrfToken {
  /** The token value */
  token: string;
  /** Token creation timestamp */
  createdAt: number;
  /** Token expiry timestamp */
  expiresAt: number;
}

/** CSRF configuration. */
export interface CsrfConfig {
  /** Secret used to sign/verify tokens */
  secret?: string;
  /** Token expiry in seconds (default: 1 hour) */
  expirySeconds?: number;
  /** Header name to check for the token */
  headerName?: string;
  /** Cookie name for the CSRF token */
  cookieName?: string;
  /** Whether to include the CSRF token cookie */
  cookieEnabled?: boolean;
}

// ─── Cookies ──────────────────────────────────────

/** Extends the base cookie config with application-level options. */
export interface SecureCookieOptions {
  /** Cookie name */
  name: CookieKey | string;
  /** Cookie value */
  value: string;
  /** Max age in seconds */
  maxAge?: number;
  /** Cookie path */
  path?: string;
  /** Whether the cookie is HTTP-only */
  httpOnly?: boolean;
  /** Whether the cookie requires HTTPS */
  secure?: boolean;
  /** SameSite attribute */
  sameSite?: "strict" | "lax" | "none";
  /** Custom domain */
  domain?: string;
  /** Expiry date */
  expires?: Date;
}

// ─── Sanitization ─────────────────────────────────

/** Sanitization options. */
export interface SanitizeOptions {
  /** Whether to strip HTML tags */
  stripHtml?: boolean;
  /** Whether to escape HTML entities */
  escapeHtml?: boolean;
  /** Whether to trim whitespace */
  trim?: boolean;
  /** Whether to normalize whitespace */
  normalizeWhitespace?: boolean;
  /** Whether to remove non-ASCII characters */
  removeNonAscii?: boolean;
  /** Maximum string length */
  maxLength?: number;
  /** Whether to remove script content entirely */
  removeScripts?: boolean;
}

/** Deep sanitization options for objects. */
export interface DeepSanitizeOptions {
  /** Max depth for recursive sanitization */
  maxDepth?: number;
  /** Array of keys to skip during sanitization */
  skipKeys?: string[];
  /** Array of allowed HTML tags (when stripHtml is false) */
  allowedTags?: string[];
}

// ─── Validation ───────────────────────────────────

/** Validation result from the generic validation helper. */
export interface ValidationResult<T = unknown> {
  /** Whether validation succeeded */
  success: boolean;
  /** Validated (and sanitized) data on success */
  data?: T;
  /** Field-level error map on failure */
  errors?: Record<string, string[]>;
  /** Form-level error message on failure */
  message?: string;
}

// ─── Security Context ─────────────────────────────

/** Runtime security context for request processing. */
export interface SecurityContext {
  /** Client IP address */
  ip?: string;
  /** Request path */
  path?: string;
  /** HTTP method */
  method?: string;
  /** User-Agent header */
  userAgent?: string;
  /** Authenticated user ID (if any) */
  userId?: string;
  /** Whether the request is over HTTPS */
  isSecure?: boolean;
}
