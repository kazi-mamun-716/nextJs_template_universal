/**
 * Dashboard feature route constants.
 */
export const DASHBOARD_ROUTES = {
  HOME: "/dashboard",
  ANALYTICS: "/dashboard/analytics",
  SETTINGS: "/dashboard/settings",
  PROFILE: "/dashboard/profile",
} as const;

export type DashboardRoute = (typeof DASHBOARD_ROUTES)[keyof typeof DASHBOARD_ROUTES];
