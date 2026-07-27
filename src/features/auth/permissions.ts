import { UserRole } from "@/constants/roles";

/**
 * Auth feature permission checks.
 */
export function canManageUsers(role: UserRole): boolean {
  return role === UserRole.ADMIN;
}

export function canModerateContent(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.MODERATOR;
}

export function canAccessAdminPanel(role: UserRole): boolean {
  return role === UserRole.ADMIN;
}
