/**
 * User role constants.
 * Uses `as const` object instead of TypeScript enum for better tree-shaking
 * and simpler type inference.
 *
 * @example
 * import { ROLES, type UserRole, isAdmin } from "@/constants/roles";
 *
 * if (user.role === ROLES.ADMIN) { ... }
 * if (isAdmin(user.role)) { ... }
 */

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

/**
 * Checks if a role is the admin role.
 */
export function isAdmin(role: UserRole): boolean {
  return role === ROLES.ADMIN;
}

/**
 * Checks if a role is the moderator role.
 */
export function isModerator(role: UserRole): boolean {
  return role === ROLES.MODERATOR;
}

/**
 * Checks if a role has administrative privileges (admin or moderator).
 */
export function isStaff(role: UserRole): boolean {
  return role === ROLES.ADMIN || role === ROLES.MODERATOR;
}

/**
 * Returns the display name for a role.
 */
export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    [ROLES.ADMIN]: "Administrator",
    [ROLES.USER]: "User",
    [ROLES.MODERATOR]: "Moderator",
  };
  return displayNames[role] ?? role;
}

/**
 * Returns the priority level of a role (higher = more privileges).
 */
export function getRolePriority(role: UserRole): number {
  const priorities: Record<UserRole, number> = {
    [ROLES.ADMIN]: 100,
    [ROLES.MODERATOR]: 50,
    [ROLES.USER]: 10,
  };
  return priorities[role] ?? 0;
}

/**
 * Checks if a role has sufficient priority (hierarchy check).
 */
export function hasMinPriority(role: UserRole, minRole: UserRole): boolean {
  return getRolePriority(role) >= getRolePriority(minRole);
}
