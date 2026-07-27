import { ROLES, type UserRole } from "@/constants/roles";

/**
 * Auth feature permission checks.
 */
export function canManageUsers(role: UserRole): boolean {
  return role === ROLES.ADMIN;
}

export function canModerateContent(role: UserRole): boolean {
  return role === ROLES.ADMIN || role === ROLES.MODERATOR;
}

export function canAccessAdminPanel(role: UserRole): boolean {
  return role === ROLES.ADMIN;
}
