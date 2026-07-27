/**
 * API-related type definitions.
 *
 * These types define the shape of API requests and responses
 * used by server actions, route handlers, and client-side fetches.
 *
 * @example
 * import type { ApiResponse, PaginatedResponse } from "@/types/api";
 *
 * function handler(): ApiResponse<{ id: string }> {
 *   return { success: true, message: "OK", data: { id: "123" } };
 * }
 */

// ─── Response Shapes ─────────────────────────────────────

/** Unified API response structure for all server actions and route handlers. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/** Standard error response (convenience type). */
export type ApiErrorResponse = ApiResponse<never> & { success: false };

/** Standard success response (convenience type). */
export type ApiSuccessResponse<T> = ApiResponse<T> & { success: true };

// ─── Pagination ──────────────────────────────────────────

/** Paginated response wrapper extending the base API response. */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

/** Pagination metadata returned in responses. */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** Pagination query parameters for requests. */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─── Sorting ─────────────────────────────────────────────

/** Sort parameters for list requests. */
export interface SortParams {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

/** Combined pagination + sort parameters. */
export interface QueryParams extends PaginationParams {
  search?: string;
  filters?: Record<string, unknown>;
}

// ─── Request & Response ──────────────────────────────────

/** Generic API handler result (consistent return type for route handlers). */
export type ApiHandlerResult<T = unknown> =
  | { status: number; body: ApiSuccessResponse<T> }
  | { status: number; body: ApiErrorResponse };

/** File upload response. */
export interface UploadResponse {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

// ─── Webhook ─────────────────────────────────────────────

/** Generic webhook payload. */
export interface WebhookPayload<T = unknown> {
  event: string;
  data: T;
  timestamp: string;
  signature?: string;
}
