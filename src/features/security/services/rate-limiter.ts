/**
 * In-memory rate limiter service.
 *
 * Provides sliding-window rate limiting using an in-memory store.
 * Suitable for single-instance deployments. For multi-instance
 * deployments, extend this to use Redis or another shared store.
 *
 * @example
 * import { rateLimiter } from "@/features/security/services/rate-limiter";
 *
 * // Check rate limit for an IP
 * const result = rateLimiter.check("api:192.168.1.1");
 *
 * if (!result.allowed) {
 *   return rateLimitResponse();
 * }
 */

import { securityConfig } from "@/config/security";
import { RATE_LIMIT_KEY_PREFIXES } from "@/features/security/constants";
import type { RateLimitConfig, RateLimitResult, RateLimitStore } from "@/features/security/types";
import { devLogger } from "@/features/logging";

// ─── Store ───────────────────────────────────────

/**
 * In-memory rate limit store.
 *
 * Periodically cleans up expired entries to prevent memory leaks.
 * Cleanup runs every 60 seconds.
 */
const store: RateLimitStore = new Map();

const CLEANUP_INTERVAL_MS = 60 * 1000;

/**
 * Periodically removes expired entries from the store.
 */
function startCleanup(): void {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      // Remove entries older than 2x the default window
      if (now - entry.createdAt > 2 * 60 * 1000) {
        store.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS);
}

// Start cleanup on module load
startCleanup();

// ─── Presets ─────────────────────────────────────

/**
 * Pre-defined rate limit presets mapped from the security config.
 */
const PRESETS: Record<string, RateLimitConfig> = {
  api: {
    max: securityConfig.rateLimit.api.max,
    windowMs: securityConfig.rateLimit.api.windowMs,
    keyPrefix: RATE_LIMIT_KEY_PREFIXES.API,
  },
  auth: {
    max: securityConfig.rateLimit.auth.max,
    windowMs: securityConfig.rateLimit.auth.windowMs,
    keyPrefix: RATE_LIMIT_KEY_PREFIXES.AUTH,
  },
  login: {
    max: securityConfig.rateLimit.login.max,
    windowMs: securityConfig.rateLimit.login.windowMs,
    keyPrefix: RATE_LIMIT_KEY_PREFIXES.LOGIN,
  },
  passwordReset: {
    max: securityConfig.rateLimit.passwordReset.max,
    windowMs: securityConfig.rateLimit.passwordReset.windowMs,
    keyPrefix: RATE_LIMIT_KEY_PREFIXES.AUTH,
  },
  email: {
    max: securityConfig.rateLimit.email.max,
    windowMs: securityConfig.rateLimit.email.windowMs,
    keyPrefix: RATE_LIMIT_KEY_PREFIXES.EMAIL,
  },
  upload: {
    max: securityConfig.rateLimit.upload.max,
    windowMs: securityConfig.rateLimit.upload.windowMs,
    keyPrefix: RATE_LIMIT_KEY_PREFIXES.UPLOAD,
  },
  dashboard: {
    max: securityConfig.rateLimit.dashboard.max,
    windowMs: securityConfig.rateLimit.dashboard.windowMs,
    keyPrefix: RATE_LIMIT_KEY_PREFIXES.DASHBOARD,
  },
};

// ─── Service ─────────────────────────────────────

export const rateLimiter = {
  /**
   * Checks whether a request should be rate limited.
   *
   * Uses a sliding window algorithm: counts requests within
   * the current time window and returns whether the limit
   * has been exceeded.
   *
   * @param identifier - Unique identifier for the client (IP, userId, API key, etc.)
   * @param config - Rate limit configuration (optional, defaults to "api" preset)
   * @returns RateLimitResult with allowed status and metadata
   *
   * @example
   * // Using a preset
   * const result = rateLimiter.check("127.0.0.1", "login");
   *
   * // Custom config
   * const result = rateLimiter.check("user_123", {
   *   max: 10, windowMs: 60_000, keyPrefix: "custom:"
   * });
   */
  check(
    identifier: string,
    configOrPreset: RateLimitConfig | string = "api",
  ): RateLimitResult {
    if (!securityConfig.rateLimit.enabled) {
      return {
        allowed: true,
        remaining: Infinity,
        resetTime: Date.now(),
        total: 0,
        limit: Infinity,
        windowSeconds: 60,
      };
    }

    // Resolve config
    const config: RateLimitConfig = typeof configOrPreset === "string"
      ? PRESETS[configOrPreset] ?? PRESETS.api
      : configOrPreset;

    const key = `${config.keyPrefix ?? "rl:"}${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get or create entry
    let entry = store.get(key);
    if (!entry) {
      entry = { timestamps: [], createdAt: now };
      store.set(key, entry);
    }

    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

    // Check limit
    const total = entry.timestamps.length;
    const allowed = total < config.max;

    if (allowed) {
      entry.timestamps.push(now);
    }

    const remaining = Math.max(0, config.max - total - (allowed ? 1 : 0));
    const resetTime = entry.timestamps.length > 0
      ? entry.timestamps[0] + config.windowMs
      : now + config.windowMs;

    // Log rate limit hits in development
    if (!allowed && securityConfig.rateLimit.logHits) {
      devLogger.warn(`[Rate Limit] ${key} exceeded (${total}/${config.max})`);
    }

    return {
      allowed,
      remaining,
      resetTime,
      total: total + (allowed ? 1 : 0),
      limit: config.max,
      windowSeconds: Math.floor(config.windowMs / 1000),
    };
  },

  /**
   * Creates a middleware-style rate limit check that returns a result
   * suitable for API route handlers.
   *
   * @param identifier - Unique client identifier
   * @param preset - Rate limit preset name (default: "api")
   * @returns RateLimitResult
   */
  middleware(identifier: string, preset: string = "api"): RateLimitResult {
    return this.check(identifier, preset);
  },

  /**
   * Resets the rate limit counter for a given identifier.
   *
   * Useful after a successful login to clear failed attempt counters.
   *
   * @param identifier - The identifier to reset
   * @param preset - Optional preset to scope the reset
   *
   * @example
   * rateLimiter.reset("127.0.0.1", "login"); // Clear failed login attempts
   */
  reset(identifier: string, preset?: string): void {
    const prefix = preset ? (PRESETS[preset]?.keyPrefix ?? "rl:") : "";
    const key = `${prefix}${identifier}`;
    store.delete(key);
  },

  /**
   * Returns the total number of entries in the rate limit store.
   * Useful for monitoring and debugging.
   */
  get storeSize(): number {
    return store.size;
  },
};
