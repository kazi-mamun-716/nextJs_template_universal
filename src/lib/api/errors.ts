/**
 * API error classes and error handler.
 *
 * Provides typed error classes for API operations, plus a `handleApiError`
 * function that converts any error into a consistent JSON response.
 *
 * @example
 * import { NotFoundError, handleApiError } from "@/lib/api/errors";
 *
 * throw new NotFoundError("User not found");
 *
 * try { ... } catch (error) {
 *   return handleApiError(error);
 * }
 */

import { HTTP_STATUS, type HttpStatusCode } from "@/constants/api-status";
import { MESSAGES } from "@/constants/messages";
import { jsonError } from "./response";

// ─── Base API Error ──────────────────────────────

/**
 * Base class for all API errors.
 * Includes an HTTP status code and optional field-level errors.
 */
export class ApiError extends Error {
  /** HTTP status code for the response. */
  public readonly statusCode: HttpStatusCode;
  /** Optional field-level validation errors. */
  public readonly errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// ─── Specific API Errors ─────────────────────────

/** 400 Bad Request. */
export class BadRequestError extends ApiError {
  constructor(message = MESSAGES.API.BAD_REQUEST, errors?: Record<string, string[]>) {
    super(message, HTTP_STATUS.BAD_REQUEST, errors);
    this.name = "BadRequestError";
  }
}

/** 401 Unauthorized. */
export class UnauthorizedError extends ApiError {
  constructor(message = MESSAGES.API.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
    this.name = "UnauthorizedError";
  }
}

/** 403 Forbidden. */
export class ForbiddenError extends ApiError {
  constructor(message = MESSAGES.API.FORBIDDEN) {
    super(message, HTTP_STATUS.FORBIDDEN);
    this.name = "ForbiddenError";
  }
}

/** 404 Not Found. */
export class NotFoundError extends ApiError {
  constructor(message = MESSAGES.API.NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND);
    this.name = "NotFoundError";
  }
}

/** 409 Conflict. */
export class ConflictError extends ApiError {
  constructor(message = MESSAGES.API.CONFLICT) {
    super(message, HTTP_STATUS.CONFLICT);
    this.name = "ConflictError";
  }
}

/** 422 Unprocessable Entity — for validation errors. */
export class ValidationError extends ApiError {
  constructor(errors: Record<string, string[]>, message = MESSAGES.API.VALIDATION_ERROR) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
    this.name = "ValidationError";
  }
}

/** 429 Too Many Requests. */
export class RateLimitError extends ApiError {
  constructor(message = MESSAGES.API.RATE_LIMITED) {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS);
    this.name = "RateLimitError";
  }
}

// ─── Error Handler ──────────────────────────────

/**
 * Converts any caught error into a consistent JSON response.
 * Passes through ApiErrors with their status codes.
 * Handles unknown errors gracefully (logs in development, returns generic message in production).
 *
 * @param error - The caught error
 * @returns NextResponse with the error details
 *
 * @example
 * export async function GET() {
 *   try {
 *     const data = await getData();
 *     return ok(data);
 *   } catch (error) {
 *     return handleApiError(error);
 *   }
 * }
 */
export function handleApiError(error: unknown) {
  // Pass through known API errors with their status codes and messages
  if (error instanceof ApiError) {
    return jsonError(error.message, error.statusCode, error.errors);
  }

  // Handle Zod validation errors
  if (error && typeof error === "object" && "name" in error && (error as { name: string }).name === "ZodError") {
    const zodError = error as import("zod").ZodError;
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of zodError.issues) {
      const path = issue.path.join(".") || "_form";
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }

    return jsonError(MESSAGES.API.VALIDATION_ERROR, HTTP_STATUS.UNPROCESSABLE_ENTITY, fieldErrors);
  }

  // Log unexpected errors in development
  if (process.env.NODE_ENV === "development") {
    console.error("[API Error]", error instanceof Error ? error.message : "Unknown error");
  }

  // Return generic error in production to avoid leaking details
  return jsonError(MESSAGES.API.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
}
