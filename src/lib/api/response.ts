/**
 * API response builders.
 *
 * Provides factory functions for creating consistent API responses
 * across all server actions and route handlers.
 *
 * @example
 * import { success, error, paginated } from "@/lib/api/response";
 *
 * return success({ id: "123" });
 * return error("Not found", 404);
 * return paginated(users, { page: 1, pageSize: 10, total: 100 });
 */

import { NextResponse } from "next/server";
import { HTTP_STATUS, type HttpStatusCode } from "@/constants/api-status";
import type { ApiResponse, ApiSuccessResponse, ApiErrorResponse, PaginatedResponse, PaginationMeta } from "@/types/api";
import { MESSAGES } from "@/constants/messages";

// ─── Response Builders (for Server Actions) ───────

/**
 * Create a success response.
 *
 * @param data - Response payload
 * @param message - Success message (optional)
 * @returns ApiResponse with success: true
 *
 * @example
 * return success({ id: "123" });
 * return success(users, "Users retrieved");
 */
export function success<T>(
  data?: T,
  message: string = MESSAGES.SUCCESS.DEFAULT,
): ApiSuccessResponse<T> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return response;
}

/**
 * Create an error response.
 *
 * @param message - Error message
 * @param errors - Optional field-level errors for form validation
 * @returns ApiResponse with success: false
 *
 * @example
 * return error("Something went wrong");
 * return error("Validation failed", { email: ["Invalid email"] });
 */
export function error(
  message: string = MESSAGES.ERROR.DEFAULT,
  errors?: Record<string, string[]>,
): ApiErrorResponse {
  const response: ApiErrorResponse = {
    success: false,
    message,
  };

  if (errors !== undefined) {
    response.errors = errors;
  }

  return response;
}

/**
 * Create a paginated success response.
 *
 * @param data - Array of items
 * @param meta - Pagination metadata
 * @param message - Success message (optional)
 * @returns PaginatedResponse
 *
 * @example
 * return paginated(users, { page: 1, pageSize: 10, total: 100 });
 */
export function paginated<T>(
  data: T[],
  meta: Omit<PaginationMeta, "totalPages"> & { totalPages?: number },
  message = "Data retrieved successfully",
): PaginatedResponse<T> {
  const totalPages = meta.totalPages ?? Math.ceil(meta.total / meta.pageSize);

  return {
    success: true,
    message,
    data,
    pagination: {
      page: meta.page,
      pageSize: meta.pageSize,
      total: meta.total,
      totalPages,
      hasNext: meta.page < totalPages,
      hasPrevious: meta.page > 1,
    },
  };
}

// ─── NextResponse Builders (for Route Handlers) ───

/**
 * Send a JSON success response via NextResponse.
 *
 * @param data - Response payload
 * @param status - HTTP status code (default: 200)
 * @param message - Success message
 * @returns NextResponse with JSON body
 *
 * @example
 * return jsonSuccess({ id: "123" });
 * return jsonSuccess(users, 201, "Created");
 */
export function jsonSuccess<T>(
  data?: T,
  status: HttpStatusCode = HTTP_STATUS.OK,
  message: string = MESSAGES.SUCCESS.DEFAULT,
): NextResponse {
  return NextResponse.json(success(data, message), { status });
}

/**
 * Send a JSON error response via NextResponse.
 *
 * @param message - Error message
 * @param status - HTTP status code (default: 500)
 * @param errors - Optional field-level errors
 * @returns NextResponse with JSON body
 *
 * @example
 * return jsonError("Not found", 404);
 * return jsonError("Validation failed", 422, { email: ["Invalid"] });
 */
export function jsonError(
  message: string = MESSAGES.ERROR.DEFAULT,
  status: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors?: Record<string, string[]>,
): NextResponse {
  return NextResponse.json(error(message, errors), { status });
}

/**
 * Send a JSON paginated response via NextResponse.
 *
 * @param data - Array of items
 * @param meta - Pagination metadata
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with JSON body
 */
export function jsonPaginated<T>(
  data: T[],
  meta: Omit<PaginationMeta, "totalPages"> & { totalPages?: number },
  status: HttpStatusCode = HTTP_STATUS.OK,
): NextResponse {
  return NextResponse.json(paginated(data, meta), { status });
}

// ─── Common HTTP Response Helpers ─────────────────

/** 200 OK */
export function ok<T>(data?: T, message?: string) {
  return jsonSuccess(data, HTTP_STATUS.OK, message);
}

/** 201 Created */
export function created<T>(data?: T, message?: string) {
  return jsonSuccess(data, HTTP_STATUS.CREATED, message ?? "Created successfully");
}

/** 204 No Content */
export function noContent() {
  return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
}

/** 400 Bad Request */
export function badRequest(message?: string, errors?: Record<string, string[]>) {
  return jsonError(message ?? MESSAGES.API.BAD_REQUEST, HTTP_STATUS.BAD_REQUEST, errors);
}

/** 401 Unauthorized */
export function unauthorized(message?: string) {
  return jsonError(message ?? MESSAGES.API.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
}

/** 403 Forbidden */
export function forbidden(message?: string) {
  return jsonError(message ?? MESSAGES.API.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
}

/** 404 Not Found */
export function notFound(message?: string) {
  return jsonError(message ?? MESSAGES.API.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
}

/** 409 Conflict */
export function conflict(message?: string) {
  return jsonError(message ?? MESSAGES.API.CONFLICT, HTTP_STATUS.CONFLICT);
}

/** 422 Unprocessable Entity */
export function unprocessable(message?: string, errors?: Record<string, string[]>) {
  return jsonError(message ?? MESSAGES.API.VALIDATION_ERROR, HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
}

/** 429 Too Many Requests */
export function tooManyRequests(message?: string) {
  return jsonError(message ?? MESSAGES.API.RATE_LIMITED, HTTP_STATUS.TOO_MANY_REQUESTS);
}

/** 500 Internal Server Error */
export function serverError(message?: string) {
  return jsonError(message ?? MESSAGES.API.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
}
