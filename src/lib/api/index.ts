/**
 * API Architecture — Public API
 *
 * Provides reusable primitives for building consistent API endpoints.
 *
 * Layers:
 * - `response` — Response builders for server actions (success, error, paginated)
 *   + NextResponse helpers for route handlers (jsonSuccess, jsonError, ok, notFound, etc.)
 * - `errors` — Typed API error classes + global `handleApiError()` error handler
 * - `handler` — Route handler wrappers (withAuth, withValidation, withErrorHandling)
 * - `action` — Server action factory (createAction combining validation + auth + handling)
 *
 * @example
 * // Server action
 * import { createAction } from "@/lib/api";
 * import { success, error } from "@/lib/api/response";
 *
 * // Route handler
 * import { withAuth, withValidation } from "@/lib/api/handler";
 * import { ok, notFound } from "@/lib/api/response";
 */

// Response builders
export {
  success,
  error,
  paginated,
  jsonSuccess,
  jsonError,
  jsonPaginated,
  ok,
  created,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessable,
  tooManyRequests,
  serverError,
} from "./response";

// Error classes + handler
export {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  handleApiError,
} from "./errors";

// Route handler wrappers
export { withAuth, withValidation, withErrorHandling, methodNotAllowed } from "./handler";
export type { AuthContext, AuthenticatedHandler, AuthOptions } from "./handler";

// Server action factory
export { createAction } from "./action";
export type { ActionConfig } from "./action";
