/**
 * User-related type definitions.
 *
 * These types define the core user domain and are shared across features.
 * Feature-specific user types should live in their respective feature folders.
 *
 * @example
 * import type { IUser, IUserSession } from "@/types/user";
 */

import type { IBaseModel } from "@/types/models";
import type { UserRole } from "@/constants/roles";

// ─── Core User ───────────────────────────────────────────

/** Core user entity (matches the Mongoose document shape). */
export interface IUser extends IBaseModel {
  email: string;
  name: string;
  image?: string;
  role: UserRole;
  emailVerified: boolean;
  password?: string;
  isActive: boolean;
  lastLoginAt?: string;
  metadata?: Record<string, unknown>;
}

/** User profile (public-facing information). */
export interface IUserProfile {
  userId: string;
  displayName: string;
  bio?: string;
  website?: string;
  location?: string;
  avatarUrl?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

/** User preferences/settings. */
export interface IUserPreferences {
  theme: "light" | "dark" | "system";
  locale: string;
  timezone: string;
  emailNotifications: boolean;
  twoFactorEnabled: boolean;
}

// ─── Session & Auth ──────────────────────────────────────

/** Minimal user data stored in the session/JWT. */
export interface IUserSession {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: UserRole;
}

/** User authentication response. */
export interface IAuthResponse {
  user: IUserSession;
  accessToken?: string;
  refreshToken?: string;
}

/** JWT token payload. */
export interface IJwtPayload {
  sub: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// ─── API Payloads ────────────────────────────────────────

/** Create user payload (for registration). */
export interface ICreateUserPayload {
  email: string;
  name: string;
  password: string;
}

/** Update user payload. */
export interface IUpdateUserPayload {
  name?: string;
  image?: string;
  metadata?: Record<string, unknown>;
}

/** User filter/query parameters for listing. */
export interface IUserQueryParams {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}
