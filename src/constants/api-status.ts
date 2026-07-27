/**
 * HTTP status code constants and API response status values.
 * Centralizes all HTTP-related constants for consistency.
 *
 * @example
 * import { HTTP_STATUS } from "@/constants/api-status";
 * return NextResponse.json(data, { status: HTTP_STATUS.CREATED });
 */

// ─── HTTP Status Codes ────────────────────────────────────
export const HTTP_STATUS = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,

  // 3xx Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,

  // 4xx Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  GONE: 410,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

/**
 * Returns the human-readable label for an HTTP status code.
 * Returns "Unknown" for codes not in the predefined list.
 */
export function getHttpStatusLabel(code: number): string {
  const labels: Partial<Record<HttpStatusCode, string>> = {
    [HTTP_STATUS.OK]: "OK",
    [HTTP_STATUS.CREATED]: "Created",
    [HTTP_STATUS.ACCEPTED]: "Accepted",
    [HTTP_STATUS.NO_CONTENT]: "No Content",
    [HTTP_STATUS.BAD_REQUEST]: "Bad Request",
    [HTTP_STATUS.UNAUTHORIZED]: "Unauthorized",
    [HTTP_STATUS.FORBIDDEN]: "Forbidden",
    [HTTP_STATUS.NOT_FOUND]: "Not Found",
    [HTTP_STATUS.CONFLICT]: "Conflict",
    [HTTP_STATUS.TOO_MANY_REQUESTS]: "Too Many Requests",
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: "Internal Server Error",
  };
  return labels[code as HttpStatusCode] ?? "Unknown";
}

// ─── API Response Status ──────────────────────────────────
/**
 * Standard API response status values used in server responses.
 */
export const API_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  FAIL: "fail",
  PENDING: "pending",
  CANCELLED: "cancelled",
} as const;

export type ApiStatus = (typeof API_STATUS)[keyof typeof API_STATUS];

// ─── API Response Helpers ─────────────────────────────────
export interface ApiStatusResponse<T = unknown> {
  status: ApiStatus;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  timestamp: string;
}

/**
 * Creates a standardized API response object with timestamp.
 */
export function createApiResponse<T>(
  status: ApiStatus,
  message: string,
  data?: T,
  errors?: Record<string, string[]>,
): ApiStatusResponse<T> {
  return {
    status,
    message,
    ...(data !== undefined && { data }),
    ...(errors !== undefined && { errors }),
    timestamp: new Date().toISOString(),
  };
}
