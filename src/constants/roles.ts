/**
 * User roles and permission constants.
 */
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator",
}

/**
 * Permission matrix defining which roles can perform which actions.
 */
export const PERMISSIONS = {
  // Users
  MANAGE_USERS: [UserRole.ADMIN],
  VIEW_USERS: [UserRole.ADMIN, UserRole.MODERATOR],
  DELETE_USERS: [UserRole.ADMIN],

  // Content
  CREATE_CONTENT: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
  EDIT_CONTENT: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
  DELETE_CONTENT: [UserRole.ADMIN, UserRole.MODERATOR],
  PUBLISH_CONTENT: [UserRole.ADMIN, UserRole.MODERATOR],

  // Settings
  MANAGE_SETTINGS: [UserRole.ADMIN],
  VIEW_SETTINGS: [UserRole.ADMIN, UserRole.MODERATOR],

  // System
  MANAGE_SYSTEM: [UserRole.ADMIN],
  VIEW_ANALYTICS: [UserRole.ADMIN, UserRole.MODERATOR],
} as const;

export type Permission = keyof typeof PERMISSIONS;
