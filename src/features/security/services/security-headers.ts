/**
 * Security headers builder service.
 *
 * Builds a complete set of HTTP security headers from configuration.
 * Designed to be used in both Next.js middleware and next.config.ts.
 *
 * @example
 * import { buildSecurityHeaders } from "@/features/security/services/security-headers";
 *
 * const headers = buildSecurityHeaders();
 * // Returns: { "Content-Security-Policy": "...", "Strict-Transport-Security": "...", ... }
 */

import { securityConfig } from "@/config/security";
import type { CSPConfig, HSTSConfig, PermissionsPolicyConfig, SecurityHeaders, PermissionsPolicyValue } from "@/features/security/types";
import { HEADER_NAMES, HEADER_VALUES } from "@/features/security/constants";

// ─── CSP Builder ─────────────────────────────────

/**
 * Builds a Content-Security-Policy header string from a CSPConfig object.
 *
 * @param config - CSP directives configuration
 * @returns Formatted CSP header value
 *
 * @example
 * buildCSP({ defaultSrc: ["'self'"], scriptSrc: ["'self'", "'unsafe-inline'"] })
 * // "default-src 'self'; script-src 'self' 'unsafe-inline'"
 */
export function buildCSP(config: CSPConfig = {}): string {
  const directives: string[] = [];

  const directiveMap: Record<string, string[] | undefined> = {
    "default-src": config.defaultSrc,
    "script-src": config.scriptSrc,
    "style-src": config.styleSrc,
    "img-src": config.imgSrc,
    "connect-src": config.connectSrc,
    "font-src": config.fontSrc,
    "object-src": config.objectSrc,
    "media-src": config.mediaSrc,
    "frame-src": config.frameSrc,
    "frame-ancestors": config.frameAncestors,
    "base-uri": config.baseUri,
    "form-action": config.formAction,
    "manifest-src": config.manifestSrc,
    "worker-src": config.workerSrc,
  };

  for (const [directive, sources] of Object.entries(directiveMap)) {
    if (sources && sources.length > 0) {
      directives.push(`${directive} ${sources.join(" ")}`);
    }
  }

  if (config.strictDynamic) {
    // Add 'strict-dynamic' to script-src if not already present
    const scriptIdx = directives.findIndex((d) => d.startsWith("script-src"));
    if (scriptIdx >= 0 && !directives[scriptIdx].includes("'strict-dynamic'")) {
      directives[scriptIdx] = `${directives[scriptIdx]} 'strict-dynamic'`;
    }
  }

  if (config.upgradeInsecureRequests) {
    directives.push("upgrade-insecure-requests");
  }

  if (config.reportUri) {
    directives.push(`report-uri ${config.reportUri}`);
  }

  return directives.join("; ");
}

// ─── HSTS Builder ────────────────────────────────

/**
 * Builds a Strict-Transport-Security header string.
 *
 * @param config - HSTS configuration
 * @returns Formatted HSTS header value
 *
 * @example
 * buildHSTS({ maxAge: 31536000, includeSubDomains: true })
 * // "max-age=31536000; includeSubDomains"
 */
export function buildHSTS(config: HSTSConfig = {}): string {
  const maxAge = config.maxAge ?? 31536000;
  const parts = [`max-age=${maxAge}`];

  if (config.includeSubDomains) {
    parts.push("includeSubDomains");
  }

  if (config.preload) {
    parts.push("preload");
  }

  return parts.join("; ");
}

// ─── Permissions-Policy Builder ─────────────────

/**
 * Builds a Permissions-Policy header string.
 *
 * @param config - Permissions-Policy configuration
 * @returns Formatted Permissions-Policy header value
 *
 * @example
 * buildPermissionsPolicy({ camera: "none", microphone: "none", geolocation: "self" })
 * // "camera=(), microphone=(), geolocation=(self)"
 */
export function buildPermissionsPolicy(config: PermissionsPolicyConfig = {}): string {
  const directives: string[] = [];

  const formatValue = (value: PermissionsPolicyValue): string => {
    if (value === "*") return "*";
    if (value === "self") return "self";
    if (value === "none") return "";
    if (Array.isArray(value)) return value.join(" ");
    return value;
  };

  for (const [feature, value] of Object.entries(config)) {
    if (value !== undefined) {
      const formatted = formatValue(value);
      directives.push(`${feature}=(${formatted})`);
    }
  }

  return directives.join(", ");
}

// ─── Main Builder ───────────────────────────────

/**
 * Builds a complete SecurityHeaders object from the application config.
 *
 * Uses the values from `securityConfig.headers` by default, but accepts
 * optional overrides for flexibility.
 *
 * @param overrides - Optional overrides for specific headers
 * @returns Complete SecurityHeaders object
 *
 * @example
 * // Default headers from config
 * const headers = buildSecurityHeaders();
 *
 * // With overrides for a specific route
 * const apiHeaders = buildSecurityHeaders({
 *   csp: { scriptSrc: ["'self'"] },
 * });
 */
export function buildSecurityHeaders(overrides?: {
  csp?: Partial<CSPConfig>;
  hsts?: Partial<HSTSConfig>;
}): SecurityHeaders {
  const { headers: cfg } = securityConfig;

  if (!cfg.enabled) {
    return {};
  }

  // Explicitly copy arrays to convert readonly → mutable for CSPConfig type compatibility
  const cspConfig: CSPConfig = {
    defaultSrc: cfg.csp.defaultSrc ? [...cfg.csp.defaultSrc] : undefined,
    scriptSrc: cfg.csp.scriptSrc ? [...cfg.csp.scriptSrc] : undefined,
    styleSrc: cfg.csp.styleSrc ? [...cfg.csp.styleSrc] : undefined,
    imgSrc: cfg.csp.imgSrc ? [...cfg.csp.imgSrc] : undefined,
    connectSrc: cfg.csp.connectSrc ? [...cfg.csp.connectSrc] : undefined,
    fontSrc: cfg.csp.fontSrc ? [...cfg.csp.fontSrc] : undefined,
    objectSrc: cfg.csp.objectSrc ? [...cfg.csp.objectSrc] : undefined,
    mediaSrc: cfg.csp.mediaSrc ? [...cfg.csp.mediaSrc] : undefined,
    frameSrc: cfg.csp.frameSrc ? [...cfg.csp.frameSrc] : undefined,
    frameAncestors: cfg.csp.frameAncestors ? [...cfg.csp.frameAncestors] : undefined,
    baseUri: cfg.csp.baseUri ? [...cfg.csp.baseUri] : undefined,
    formAction: cfg.csp.formAction ? [...cfg.csp.formAction] : undefined,
    manifestSrc: cfg.csp.manifestSrc ? [...cfg.csp.manifestSrc] : undefined,
    workerSrc: cfg.csp.workerSrc ? [...cfg.csp.workerSrc] : undefined,
    strictDynamic: cfg.csp.strictDynamic,
    upgradeInsecureRequests: cfg.csp.upgradeInsecureRequests,
    reportUri: cfg.csp.reportUri,
    ...overrides?.csp,
  };

  const hstsConfig: HSTSConfig = {
    ...cfg.hsts,
    ...overrides?.hsts,
  };

  const headers: SecurityHeaders = {
    contentSecurityPolicy: buildCSP(cspConfig),
    strictTransportSecurity: buildHSTS(hstsConfig),
    referrerPolicy: HEADER_VALUES.REFERRER_POLICY_STRICT,
    xFrameOptions: cfg.xFrameOptions,
    permissionsPolicy: buildPermissionsPolicy(cfg.permissionsPolicy),
  };

  // Optional headers
  if (cfg.xContentTypeOptions) {
    headers.xContentTypeOptions = HEADER_VALUES.X_CONTENT_TYPE_OPTIONS_NOSNIFF;
  }

  if (cfg.xDnsPrefetchControl) {
    headers.xDnsPrefetchControl = HEADER_VALUES.DNS_PREFETCH_OFF;
  }

  if (cfg.crossOriginIsolation) {
    headers.crossOriginEmbedderPolicy = HEADER_VALUES.COEP_REQUIRE_CORP;
    headers.crossOriginOpenerPolicy = HEADER_VALUES.COOP_SAME_ORIGIN;
    headers.crossOriginResourcePolicy = HEADER_VALUES.CORP_SAME_ORIGIN;
  }

  return headers;
}

// ─── Convert to Next.js Header Format ───────────

/**
 * Converts a SecurityHeaders object to the format expected by
 * Next.js middleware (Record<string, string>).
 *
 * @param headers - SecurityHeaders object from buildSecurityHeaders()
 * @returns Record of header key-value pairs for Next.js Response
 */
export function securityHeadersToRecord(headers: SecurityHeaders): Record<string, string> {
  const record: Record<string, string> = {};

  const headerMap: Record<string, string | undefined> = {
    [HEADER_NAMES.CONTENT_SECURITY_POLICY]: headers.contentSecurityPolicy,
    [HEADER_NAMES.STRICT_TRANSPORT_SECURITY]: headers.strictTransportSecurity,
    [HEADER_NAMES.X_CONTENT_TYPE_OPTIONS]: headers.xContentTypeOptions,
    [HEADER_NAMES.X_FRAME_OPTIONS]: headers.xFrameOptions,
    [HEADER_NAMES.REFERRER_POLICY]: headers.referrerPolicy,
    [HEADER_NAMES.PERMISSIONS_POLICY]: headers.permissionsPolicy,
    [HEADER_NAMES.X_DNS_PREFETCH_CONTROL]: headers.xDnsPrefetchControl,
    [HEADER_NAMES.CROSS_ORIGIN_EMBEDDER_POLICY]: headers.crossOriginEmbedderPolicy,
    [HEADER_NAMES.CROSS_ORIGIN_OPENER_POLICY]: headers.crossOriginOpenerPolicy,
    [HEADER_NAMES.CROSS_ORIGIN_RESOURCE_POLICY]: headers.crossOriginResourcePolicy,
    [HEADER_NAMES.CACHE_CONTROL]: headers.cacheControl,
  };

  for (const [key, value] of Object.entries(headerMap)) {
    if (value !== undefined) {
      record[key] = value;
    }
  }

  return record;
}
