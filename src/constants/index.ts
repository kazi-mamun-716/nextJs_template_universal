/**
 * Constants barrel export.
 *
 * Import constants from a single location:
 * @example import { ROUTES, ROLES, MESSAGES, HTTP_STATUS } from "@/constants";
 */

export { ROUTES, buildRoute, matchRoute, isAuthRoute, isDashboardRoute, isPublicRoute } from "./routes";
export type { Route } from "./routes";

export { ROLES, isAdmin, isModerator, isStaff, getRoleDisplayName, getRolePriority, hasMinPriority } from "./roles";
export type { UserRole } from "./roles";

export { PERMISSIONS, hasPermission, can } from "./permissions";
export type { Permission } from "./permissions";

export { REGEX, matchRegex } from "./regex";
export type { RegexKey } from "./regex";

export { MESSAGES } from "./messages";
export type { MessageCategory } from "./messages";

export { HTTP_STATUS, API_STATUS, createApiResponse, getHttpStatusLabel } from "./api-status";
export type { HttpStatusCode, ApiStatus, ApiStatusResponse } from "./api-status";

export { COOKIE_KEYS, COOKIE_CONFIG } from "./cookie-keys";
export type { CookieKey } from "./cookie-keys";

export { LOCAL_STORAGE_KEYS, SESSION_STORAGE_KEYS, storage } from "./storage-keys";
export type { LocalStorageKey, SessionStorageKey } from "./storage-keys";
