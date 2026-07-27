/**
 * Permission matrix and authorization utilities.
 *
 * Defines which roles can perform which actions.
 * Centralizes all authorization logic for consistency.
 *
 * @example
 * import { PERMISSIONS, can } from "@/constants/permissions";
 * import { ROLES } from "@/constants/roles";
 *
 * if (can(ROLES.ADMIN).manageUsers) { ... }
 * if (PERMISSIONS.MANAGE_USERS.includes(user.role)) { ... }
 */

import { ROLES, type UserRole } from "@/constants/roles";

/**
 * Permission matrix defining which roles can perform each action.
 * Add new permissions here as the application grows.
 */
export const PERMISSIONS = {
  // ─── Users ───────────────────────────────────────────────
  MANAGE_USERS: [ROLES.ADMIN] as UserRole[],
  VIEW_USERS: [ROLES.ADMIN, ROLES.MODERATOR] as UserRole[],
  CREATE_USERS: [ROLES.ADMIN] as UserRole[],
  EDIT_USERS: [ROLES.ADMIN, ROLES.MODERATOR] as UserRole[],
  DELETE_USERS: [ROLES.ADMIN] as UserRole[],
  IMPERSONATE_USERS: [ROLES.ADMIN] as UserRole[],

  // ─── Content ─────────────────────────────────────────────
  CREATE_CONTENT: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER] as UserRole[],
  EDIT_CONTENT: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER] as UserRole[],
  DELETE_CONTENT: [ROLES.ADMIN, ROLES.MODERATOR] as UserRole[],
  PUBLISH_CONTENT: [ROLES.ADMIN, ROLES.MODERATOR] as UserRole[],
  ARCHIVE_CONTENT: [ROLES.ADMIN, ROLES.MODERATOR] as UserRole[],
  FEATURE_CONTENT: [ROLES.ADMIN] as UserRole[],

  // ─── Settings ────────────────────────────────────────────
  MANAGE_SETTINGS: [ROLES.ADMIN] as UserRole[],
  VIEW_SETTINGS: [ROLES.ADMIN, ROLES.MODERATOR] as UserRole[],
  MANAGE_SYSTEM: [ROLES.ADMIN] as UserRole[],
  VIEW_ANALYTICS: [ROLES.ADMIN, ROLES.MODERATOR] as UserRole[],
  EXPORT_DATA: [ROLES.ADMIN] as UserRole[],

  // ─── Billing ─────────────────────────────────────────────
  VIEW_BILLING: [ROLES.ADMIN] as UserRole[],
  MANAGE_BILLING: [ROLES.ADMIN] as UserRole[],
  VIEW_INVOICES: [ROLES.ADMIN, ROLES.USER] as UserRole[],

  // ─── Notifications ───────────────────────────────────────
  SEND_NOTIFICATIONS: [ROLES.ADMIN, ROLES.MODERATOR] as UserRole[],
  MANAGE_TEMPLATES: [ROLES.ADMIN] as UserRole[],
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Checks if a role has a specific permission.
 *
 * @example
 * hasPermission(user.role, "MANAGE_USERS") // true | false
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles.includes(role);
}

/**
 * Creates a permission-checking object for a given role.
 * Provides dot-notation access to all permissions.
 *
 * @example
 * const userRole = ROLES.MODERATOR;
 * can(userRole).deleteContent  // true
 * can(userRole).manageUsers    // false
 */
export function can(role: UserRole): Record<Permission, boolean> {
  const result = {} as Record<Permission, boolean>;
  for (const permission of Object.keys(PERMISSIONS) as Permission[]) {
    result[permission] = hasPermission(role, permission);
  }
  return result;
}
