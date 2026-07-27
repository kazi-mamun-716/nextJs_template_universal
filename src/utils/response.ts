import type { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";
import { paginationConfig } from "@/config/pagination";

/**
 * Creates a success response.
 */
export function successResponse<T>(data: T, message = "Success"): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Creates an error response.
 */
export function errorResponse(
  message: string,
  errors?: Record<string, string[]>,
): ApiResponse {
  return {
    success: false,
    message,
    ...(errors && { errors }),
  };
}

/**
 * Creates a paginated success response.
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams,
  message = "Success",
): PaginatedResponse<T> {
  const page = params.page ?? paginationConfig.defaultPage;
  const pageSize = params.pageSize ?? paginationConfig.defaultPageSize;
  const totalPages = Math.ceil(total / pageSize);

  return {
    success: true,
    message,
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
}
