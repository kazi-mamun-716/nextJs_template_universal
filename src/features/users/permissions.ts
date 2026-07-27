import { UserRole } from "@/constants/roles";

/**
 * Users feature permission checks.
 */
export function canViewAllUsers(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.MODERATOR;
}

export function canEditUser(role: UserRole, targetRole: UserRole): boolean {
  if (role === UserRole.ADMIN) return true;
  if (role === UserRole.MODERATOR && targetRole === UserRole.USER) return true;
  return false;
}

export function canDeleteUser(role: UserRole): boolean {
  return role === UserRole.ADMIN;
}
