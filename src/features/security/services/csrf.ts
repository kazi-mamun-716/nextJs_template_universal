/**
 * CSRF (Cross-Site Request Forgery) protection service.
 *
 * Provides token generation and validation for custom API routes
 * beyond what Auth.js provides. Uses a simple HMAC-based token
 * approach that does not require server-side storage.
 *
 * @example
 * // Generate a token for a form
 * const token = await csrf.generateToken();
 * // Include as hidden field: <input name="csrf_token" value={token} />
 *
 * // Validate on submission
 * const isValid = await csrf.validateToken(token, body.csrf_token);
 */

import { securityConfig } from "@/config/security";
import { CSRF_PROTECTED_METHODS } from "@/features/security/constants";
import type { CsrfToken } from "@/features/security/types";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

// ─── Helpers ────────────────────────────────────

/**
 * Gets the HMAC secret for CSRF token signing.
 * Falls back to a hash of NEXTAUTH_SECRET if no explicit secret is provided.
 */
function getSecret(): string {
  return securityConfig.csrf.secret ?? process.env.NEXTAUTH_SECRET ?? "csrf-fallback-secret";
}

/**
 * Creates an HMAC-SHA256 signature for a given value.
 */
function sign(value: string): string {
  return createHmac("sha256", getSecret())
    .update(value)
    .digest("hex");
}

/**
 * Generates a random token string.
 */
function generateRandomToken(): string {
  return randomBytes(32).toString("hex");
}

// ─── Service ─────────────────────────────────────

export const csrf = {
  /**
   * Generates a CSRF token.
   *
   * The token is an HMAC-signed random value, making it
   * verifiable without server-side storage.
   *
   * @param options - Optional overrides
   * @returns CsrfToken object with the token and expiry
   *
   * @example
   * const token = await csrf.generateToken();
   * // { token: "abc123...", createdAt: 1700000000000, expiresAt: 1700003600000 }
   */
  async generateToken(options?: {
    expirySeconds?: number;
  }): Promise<CsrfToken> {
    const now = Date.now();
    const expirySeconds = options?.expirySeconds ?? securityConfig.csrf.expirySeconds;
    const random = generateRandomToken();
    const expiry = now + expirySeconds * 1000;

    // Token format: random.timestamp.expiry.signature
    const payload = `${random}:${now}:${expiry}`;
    const signature = sign(payload);
    const token = `${payload}:${signature}`;

    return {
      token,
      createdAt: now,
      expiresAt: expiry,
    };
  },

  /**
   * Validates a CSRF token.
   *
   * Checks the HMAC signature and verifies the token hasn't expired.
   *
   * @param token - The token to validate
   * @returns True if the token is valid and not expired
   *
   * @example
   * const valid = await csrf.validateToken(token);
   * if (!valid) { throw new Error("Invalid CSRF token"); }
   */
  async validateToken(token: string): Promise<boolean> {
    const parts = token.split(":");

    // Token format: random.timestamp.expiry.signature (4 parts)
    if (parts.length !== 4) {
      return false;
    }

    const [random, createdAt, expiry, signature] = parts;

    // Check expiry
    const expiryNum = Number(expiry);
    if (isNaN(expiryNum) || Date.now() > expiryNum) {
      return false;
    }

    // Verify signature using timing-safe comparison
    const payload = `${random}:${createdAt}:${expiry}`;
    const expectedSignature = sign(payload);

    if (signature.length !== expectedSignature.length) {
      return false;
    }

    try {
      return timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    } catch {
      return false;
    }
  },

  /**
   * Checks whether the request method requires CSRF protection.
   *
   * @param method - HTTP method
   * @returns True if the method should be protected
   */
  requiresProtection(method: string): boolean {
    return CSRF_PROTECTED_METHODS.has(method.toUpperCase());
  },

  /**
   * Extracts the CSRF token from a request.
   *
   * Checks headers first (X-CSRF-Token), then falls back to body.
   *
   * @param request - The incoming request
   * @returns The extracted token, or null if not found
   *
   * @example
   * const token = await csrf.extractToken(request);
   */
  async extractToken(request: Request): Promise<string | null> {
    // Check header first
    const headerToken = request.headers.get(securityConfig.csrf.headerName);
    if (headerToken) {
      return headerToken;
    }

    // Fall back to body field
    try {
      const body = await request.clone().json();
      const bodyToken = body[securityConfig.csrf.headerName.replace(/-/g, "_")]
        ?? body._csrf
        ?? body.csrf_token;
      if (typeof bodyToken === "string") {
        return bodyToken;
      }
    } catch {
      // Body not JSON or empty — ignore
    }

    return null;
  },

  /**
   * Middleware-style protection handler.
   *
   * Extracts and validates the CSRF token for protected methods.
   *
   * @param request - The incoming request
   * @returns Result object with success flag and optional error message
   *
   * @example
   * const result = await csrf.protect(request);
   * if (!result.success) {
   *   return NextResponse.json({ error: result.message }, { status: 403 });
   * }
   */
  async protect(request: Request): Promise<{ success: boolean; message?: string }> {
    if (!securityConfig.csrf.enabled) {
      return { success: true };
    }

    if (!this.requiresProtection(request.method)) {
      return { success: true };
    }

    const token = await this.extractToken(request);

    if (!token) {
      return {
        success: false,
        message: "Missing CSRF token. Include it in the X-CSRF-Token header or request body.",
      };
    }

    const valid = await this.validateToken(token);
    if (!valid) {
      return {
        success: false,
        message: "Invalid or expired CSRF token. Please refresh the page and try again.",
      };
    }

    return { success: true };
  },
};
