/**
 * Input sanitization service.
 *
 * Provides functions for sanitizing user input to prevent
 * XSS, SQL injection, and other injection attacks.
 *
 * Extends the basic sanitization utilities in @/utils/string/sanitize
 * with deep-object sanitization and security-focused detection.
 *
 * @example
 * import { sanitizer } from "@/features/security/services/sanitizer";
 *
 * // Sanitize a single string
 * const clean = sanitizer.sanitize('<script>alert("xss")</script>Hello');
 * // "Hello"
 *
 * // Deep sanitize an object
 * const formData = sanitizer.deepSanitize(req.body);
 */

import { escapeHtml, stripHtml, normalizeWhitespace } from "@/utils/string/sanitize";
import { securityConfig } from "@/config/security";
import {
  DEFAULT_SANITIZE_OPTIONS,
  SQL_INJECTION_PATTERNS,
  SAFE_HTML_TAGS,
  SAFE_HTML_ATTRIBUTES,
  SECURITY_ERROR_CODES,
} from "@/features/security/constants";
import type { SanitizeOptions, DeepSanitizeOptions } from "@/features/security/types";

// ─── Helpers ────────────────────────────────────

/**
 * Truncates a string to a maximum length while preserving whole words.
 */
function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 0 ? `${truncated.slice(0, lastSpace)}...` : `${truncated}...`;
}

/**
 * Sanitizes HTML content, removing dangerous tags and attributes
 * while preserving safe ones.
 */
function sanitizeHtml(html: string, allowedTags: Set<string> = SAFE_HTML_TAGS): string {
  // Remove script and style tags entirely
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove event handler attributes (onclick, onload, etc.)
  html = html.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  // Remove dangerous attributes (javascript: URLs, etc.)
  html = html.replace(/\bhref\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'href="#"');
  html = html.replace(/\bsrc\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'src="#"');

  // Remove data: URIs in dangerous contexts
  html = html.replace(/\bsrc\s*=\s*"data:\s*text\/html[^"]*"/gi, 'src="#"');

  // Strip tags not in the allowed set
  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tagName) => {
    const lowerTag = tagName.toLowerCase();
    if (allowedTags.has(lowerTag)) {
      // Strip attributes not in the safe set
      return match.replace(/\s([a-zA-Z-]+)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/g, (attrMatch, attrName) => {
        const lowerAttr = attrName.toLowerCase();
        if (SAFE_HTML_ATTRIBUTES.has(lowerAttr)) {
          return attrMatch;
        }
        // Keep class/id but strip any that start with "on" or contain "script"
        if (lowerAttr.startsWith("on") || lowerAttr.includes("script")) {
          return "";
        }
        return attrMatch;
      });
    }
    return "";
  });
}

/**
 * Detects potential SQL injection patterns in a string.
 */
function detectSqlInjection(text: string): boolean {
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

// ─── Service ─────────────────────────────────────

export const sanitizer = {
  /**
   * Sanitizes a single string value.
   *
   * Applies the specified sanitization options in order:
   * 1. Optionally strips HTML tags
   * 2. Optionally removes script content
   * 3. Optionally escapes HTML entities
   * 4. Optionally trims whitespace
   * 5. Optionally normalizes whitespace
   * 6. Optionally removes non-ASCII characters
   * 7. Optionally truncates to max length
   *
   * @param value - The string to sanitize
   * @param options - Sanitization options (defaults to security config)
   * @returns The sanitized string
   *
   * @example
   * sanitizer.sanitize(userInput);
   * sanitizer.sanitize(userInput, { stripHtml: true, maxLength: 500 });
   */
  sanitize(value: string, options: SanitizeOptions = {}): string {
    if (!securityConfig.sanitization.enabled) {
      return value;
    }

    const opts = { ...DEFAULT_SANITIZE_OPTIONS, ...options };
    let result = value;

    // Remove scripts if configured
    if (opts.removeScripts) {
      result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
      result = result.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
    }

    // Strip HTML tags
    if (opts.stripHtml) {
      result = stripHtml(result);
    }

    // Escape HTML entities (after stripping, catches any remaining)
    if (opts.escapeHtml) {
      result = escapeHtml(result);
    }

    // Trim whitespace
    if (opts.trim) {
      result = result.trim();
    }

    // Normalize whitespace
    if (opts.normalizeWhitespace) {
      result = normalizeWhitespace(result);
    }

    // Remove non-ASCII characters
    if (opts.removeNonAscii) {
      result = result.replace(/[^\x20-\x7E]/g, "");
    }

    // Truncate to max length
    if (opts.maxLength && result.length > opts.maxLength) {
      result = truncateAtWordBoundary(result, opts.maxLength);
    }

    return result;
  },

  /**
   * Deep-sanitizes an object, recursively sanitizing all string values.
   *
   * Handles nested objects, arrays, and Date objects. Skips specified keys
   * and respects maximum nesting depth.
   *
   * @param input - The input value (object, array, string, etc.)
   * @param options - Deep sanitization options
   * @returns The sanitized value
   *
   * @example
   * const clean = sanitizer.deepSanitize(request.body, {
   *   maxDepth: 5,
   *   skipKeys: ["password", "token"],
   * });
   */
  deepSanitize<T>(input: T, options: DeepSanitizeOptions = {}): T {
    const opts = {
      maxDepth: options.maxDepth ?? 10,
      skipKeys: options.skipKeys ?? [],
      allowedTags: options.allowedTags,
    };

    const sanitizeValue = (value: unknown, depth: number): unknown => {
      if (depth > opts.maxDepth) {
        return value;
      }

      if (typeof value === "string") {
        return this.sanitize(value, {
          stripHtml: securityConfig.sanitization.stripHtml,
          escapeHtml: securityConfig.sanitization.escapeHtml,
          maxLength: securityConfig.sanitization.maxLength,
        });
      }

      if (value === null || value === undefined) {
        return value;
      }

      if (Array.isArray(value)) {
        return value.map((item) => sanitizeValue(item, depth + 1));
      }

      if (value instanceof Date) {
        return value;
      }

      if (typeof value === "object") {
        const result: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
          if (opts.skipKeys.includes(key)) {
            result[key] = val;
          } else {
            result[key] = sanitizeValue(val, depth + 1);
          }
        }
        return result;
      }

      // Numbers, booleans, etc. — return as-is
      return value;
    };

    return sanitizeValue(input, 0) as T;
  },

  /**
   * Sanitizes HTML content, preserving safe tags while removing
   * dangerous elements (scripts, event handlers, javascript: URLs).
   *
   * @param html - The HTML content to sanitize
   * @param allowedTags - Optional set of allowed HTML tags
   * @returns Sanitized HTML
   *
   * @example
   * const safeHtml = sanitizer.sanitizeHtml(userHtmlContent);
   */
  sanitizeHtml(html: string, allowedTags?: Set<string>): string {
    return sanitizeHtml(html, allowedTags);
  },

  /**
   * Detects potential SQL injection in a string.
   *
   * @param value - The string to check
   * @returns True if SQL injection patterns were detected
   *
   * @example
   * if (sanitizer.hasSqlInjection(userInput)) {
   *   // Reject the input
   * }
   */
  hasSqlInjection(value: string): boolean {
    if (!securityConfig.sanitization.detectSqlInjection) {
      return false;
    }
    return detectSqlInjection(value);
  },

  /**
   * Validates and sanitizes user input, returning a result
   * with the sanitized value or an error message.
   *
   * @param value - The input value to check
   * @param options - Sanitization options
   * @returns Object with success flag and sanitized value or error
   *
   * @example
   * const result = sanitizer.validateAndSanitize(userInput);
   * if (!result.valid) {
   *   return { error: result.error };
   * }
   */
  validateAndSanitize(value: string, options: SanitizeOptions = {}): { valid: true; sanitized: string } | { valid: false; error: string } {
    // Check for SQL injection
    if (securityConfig.sanitization.detectSqlInjection && this.hasSqlInjection(value)) {
      return { valid: false, error: "Input contains prohibited patterns" };
    }

    // Sanitize and return
    const sanitized = this.sanitize(value, options);
    return { valid: true, sanitized };
  },

  /**
   * Sanitizes a URL to prevent javascript: and other dangerous schemes.
   *
   * @param url - The URL to sanitize
   * @returns The sanitized URL, or "#" if dangerous
   *
   * @example
   * const safeUrl = sanitizer.sanitizeUrl(userProvidedUrl);
   */
  sanitizeUrl(url: string): string {
    // Allow only http, https, mailto, tel, and relative URLs
    if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url)) {
      return url;
    }
    return "#";
  },

  /**
   * Returns the security error code for a suspicious input.
   */
  getSuspiciousInputErrorCode(): string {
    return SECURITY_ERROR_CODES.SUSPICIOUS_INPUT;
  },
};
