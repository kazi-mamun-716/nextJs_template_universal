/**
 * Error logger service.
 *
 * Captures errors with context metadata and forwards them to the
 * application logger. Designed to be called from error boundaries,
 * API error handlers, and catch blocks.
 *
 * @example
 * import { errorLogger } from "@/features/errors/services/error-logger";
 *
 * errorLogger.capture(error, { level: "error", source: "UserProfile" });
 */

import { logger } from "@/utils/logger";
import type { ErrorLevel, ErrorMetadata } from "../types";

export interface CaptureOptions {
  /** Error severity level. */
  level?: ErrorLevel;
  /** Component or module where the error occurred. */
  source?: string;
  /** User-friendly error code. */
  code?: string;
  /** Whether the error is recoverable. */
  recoverable?: boolean;
  /** Additional context key-value pairs. */
  context?: Record<string, unknown>;
}

class ErrorLogger {
  /**
   * Capture an error with metadata and log it.
   *
   * @param error - The error to capture
   * @param options - Additional metadata options
   * @returns The generated error metadata
   */
  capture(error: unknown, options: CaptureOptions = {}): ErrorMetadata {
    const metadata: ErrorMetadata = {
      level: options.level ?? "error",
      source: options.source,
      code: options.code,
      recoverable: options.recoverable ?? false,
      context: options.context,
      timestamp: new Date().toISOString(),
    };

    const errorInstance = error instanceof Error ? error : new Error(String(error));
    const message = `[${metadata.level.toUpperCase()}]${metadata.source ? ` [${metadata.source}]` : ""} ${errorInstance.message}`;

    switch (metadata.level) {
      case "info":
      case "warning":
        logger.warn(message, { ...metadata.context, metadata });
        break;
      case "error":
      case "critical":
        logger.error(message, { ...metadata.context, metadata }, errorInstance);
        break;
    }

    return metadata;
  }

  /**
   * Generate a short, unique error tracking ID.
   * Useful for showing to users so they can reference the error.
   */
  generateErrorId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ERR-${timestamp}-${random}`;
  }
}

export const errorLogger = new ErrorLogger();
