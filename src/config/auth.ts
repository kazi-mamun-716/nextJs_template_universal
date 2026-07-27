/**
 * Authentication configuration.
 *
 * All auth-related settings are centralized here.
 * Provider credentials come from validated env vars.
 */
import { env } from "@/config/env";

export const authConfig = {
  /** Session duration in seconds (30 days) */
  sessionMaxAge: 30 * 24 * 60 * 60,

  /** Password policy requirements */
  password: {
    /** Minimum password length */
    minLength: 8,
    /** Maximum password length */
    maxLength: 128,
    /** Require at least one uppercase letter */
    requireUppercase: true,
    /** Require at least one lowercase letter */
    requireLowercase: true,
    /** Require at least one digit */
    requireNumber: true,
    /** Require at least one special character */
    requireSpecialChar: false,
  },

  /** OAuth provider configurations */
  providers: {
    google: {
      enabled: !!env.AUTH_GOOGLE_ID,
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
    github: {
      enabled: !!env.AUTH_GITHUB_ID,
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
  },

  /** Auth.js configuration */
  authJs: {
    secret: env.AUTH_SECRET,
    url: env.AUTH_URL,
    trustHost: true,
  },
} as const;

export type AuthConfig = typeof authConfig;
