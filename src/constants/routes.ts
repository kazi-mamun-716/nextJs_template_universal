/**
 * Application route constants.
 * Centralizes all route paths to prevent hardcoded strings.
 */
export const ROUTES = {
  // Public
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Dashboard
  DASHBOARD: "/dashboard",
  DASHBOARD_ANALYTICS: "/dashboard/analytics",
  DASHBOARD_SETTINGS: "/dashboard/settings",
  DASHBOARD_PROFILE: "/dashboard/profile",

  // API
  API_AUTH: "/api/auth",
  API_WEBHOOKS: "/api/webhooks",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
