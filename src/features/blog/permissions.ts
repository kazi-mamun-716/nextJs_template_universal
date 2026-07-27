/**
 * Blog feature permission checks.
 */
import { ROLES, type UserRole } from "@/constants/roles";

/**
 * Whether the user can create new posts.
 * Authenticated users can create posts.
 */
export function canCreatePost(role: UserRole): boolean {
  return role === ROLES.ADMIN || role === ROLES.USER || role === ROLES.MODERATOR;
}

/**
 * Whether the user can edit any post (admin/moderator).
 * Regular users can only edit their own posts — enforced in the service layer.
 */
export function canEditAnyPost(role: UserRole): boolean {
  return role === ROLES.ADMIN || role === ROLES.MODERATOR;
}

/**
 * Whether the user can delete any post.
 */
export function canDeleteAnyPost(role: UserRole): boolean {
  return role === ROLES.ADMIN;
}

/**
 * Whether the user can moderate posts (approve, archive, feature).
 */
export function canModeratePosts(role: UserRole): boolean {
  return role === ROLES.ADMIN || role === ROLES.MODERATOR;
}
