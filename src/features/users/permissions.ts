import { ROLES, type UserRole } from "@/constants/roles";

/**
 * Users feature permission checks.
 */
export function canViewAllUsers(role: UserRole): boolean {
  return role === ROLES.ADMIN || role === ROLES.MODERATOR;
}

export function canEditUser(role: UserRole, targetRole: UserRole): boolean {
  if (role === ROLES.ADMIN) return true;
  if (role === ROLES.MODERATOR && targetRole === ROLES.USER) return true;
  return false;
}

export function canDeleteUser(role: UserRole): boolean {
  return role === ROLES.ADMIN;
}
