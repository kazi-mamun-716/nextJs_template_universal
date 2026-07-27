/**
 * API Logger — captures request/response metadata for observability.
 *
 * Designed to be used in Next.js route handlers and middleware
 * to log every API call with timing, status, and user context.
 *
 * @example
 * import { apiLogger } from "@/features/logging/services/api-logger";
 *
 * export async function GET(request: NextRequest) {
 *   const done = apiLogger.start(request);
 *   const data = await getData();
 *   return done(ok(data));
 * }
 *
 * // With error handling:
 * try {
 *   return done(ok(data));
 * } catch (error) {
 *   return done(serverError(), error);
 * }
 */

import { logger } from "@/utils/logger";
import type { NextRequest } from "next/server";
import type { ApiLoggerOptions, ApiLogEntry } from "../types";
import { DEFAULT_API_LOGGER_OPTIONS, MUTATING_METHODS } from "../constants";

type ApiMethod = ApiLogEntry["method"];

class ApiLogger {
  private options: Required<ApiLoggerOptions>;

  constructor(options?: ApiLoggerOptions) {
    this.options = {
      enabled: options?.enabled ?? DEFAULT_API_LOGGER_OPTIONS.enabled,
      logRequestBody: options?.logRequestBody ?? DEFAULT_API_LOGGER_OPTIONS.logRequestBody,
      logResponseBody: options?.logResponseBody ?? DEFAULT_API_LOGGER_OPTIONS.logResponseBody,
      logAlwaysStatuses: options?.logAlwaysStatuses ?? [...DEFAULT_API_LOGGER_OPTIONS.logAlwaysStatuses],
    };
  }

  /**
   * Start timing an API request.
   * Returns a `done` function that finalises and logs the entry.
   *
   * @param request - The incoming NextRequest
   * @param userId - Optional authenticated user ID
   * @returns A function to call with the response and optional error
   *
   * @example
   * const done = apiLogger.start(request, session?.user?.id);
   * // ... handle request ...
   * return done(NextResponse.json({ ... }));
   */
  start(request: NextRequest, userId?: string) {
    const startTime = performance.now();
    const method = request.method as ApiMethod;
    const path = new URL(request.url).pathname;
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;
    const userAgent = request.headers.get("user-agent") ?? undefined;

    return (
      response: { status?: number; statusCode?: number } | Response,
      error?: unknown,
    ): Response => {
      const durationMs = Math.round(performance.now() - startTime);
      const statusCode = error
        ? 500
        : (response as { status?: number; statusCode?: number }).status
          ?? (response as Response).status
          ?? 200;

      const entry: ApiLogEntry = {
        method,
        path,
        statusCode,
        durationMs,
        userId,
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : error ? String(error) : undefined,
      };

      this.log(entry);
      return response as Response;
    };
  }

  /**
   * Log a pre-built API log entry.
   */
  log(entry: ApiLogEntry): void {
    if (!this.options.enabled) return;

    const isError = entry.statusCode >= 400;
    const isMutating = (MUTATING_METHODS as readonly string[]).includes(entry.method);
    const isAlwaysLog = this.options.logAlwaysStatuses.includes(entry.statusCode);

    // Always log errors, mutations, and configured statuses
    if (!isError && !isMutating && !isAlwaysLog) return;

    const level = entry.statusCode >= 500 ? "error" : entry.statusCode >= 400 ? "warn" : "info";
    const prefix = `[API] ${entry.method} ${entry.path} → ${entry.statusCode} (${entry.durationMs}ms)`;

    const context: Record<string, unknown> = {
      method: entry.method,
      path: entry.path,
      statusCode: entry.statusCode,
      durationMs: entry.durationMs,
      timestamp: entry.timestamp,
    };

    if (entry.userId) context.userId = entry.userId;
    if (entry.ip) context.ip = entry.ip;
    if (entry.error) context.errorMessage = entry.error;

    logger[level](prefix, context);
  }

  /**
   * Configure the logger at runtime.
   */
  configure(options: Partial<ApiLoggerOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

export const apiLogger = new ApiLogger();
