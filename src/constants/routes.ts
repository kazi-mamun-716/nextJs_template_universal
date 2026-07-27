/**
 * Application route constants.
 * Centralizes all route paths to prevent hardcoded strings across the codebase.
 *
 * @example
 * import { ROUTES } from "@/constants/routes";
 * router.push(ROUTES.LOGIN);             // "/login"
 * router.push(ROUTES.DASHBOARD_HOME);    // "/dashboard"
 */

export const ROUTES = {
  // ─── Public ──────────────────────────────────────────────
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  PRICING: "/pricing",
  FAQ: "/faq",
  TERMS: "/terms",
  PRIVACY: "/privacy",

  // ─── Auth ────────────────────────────────────────────────
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",

  // ─── Dashboard ───────────────────────────────────────────
  DASHBOARD_HOME: "/dashboard",
  DASHBOARD_ANALYTICS: "/dashboard/analytics",
  DASHBOARD_SETTINGS: "/dashboard/settings",
  DASHBOARD_PROFILE: "/dashboard/profile",
  DASHBOARD_USERS: "/dashboard/users",
  DASHBOARD_USER_DETAIL: "/dashboard/users",
  DASHBOARD_CONTENT: "/dashboard/content",

  // ─── Blog ────────────────────────────────────────────────
  BLOG: "/blog",
  BLOG_POST: "/blog", // /blog/:slug — use buildRoute
  DASHBOARD_BLOG: "/dashboard/blog",
  DASHBOARD_BLOG_NEW: "/dashboard/blog/new",
  DASHBOARD_BLOG_EDIT: "/dashboard/blog", // /dashboard/blog/:id/edit

  // ─── API ─────────────────────────────────────────────────
  API_AUTH: "/api/auth",
  API_AUTH_SESSION: "/api/auth/session",
  API_AUTH_CSRF: "/api/auth/csrf",
  API_AUTH_CALLBACK: "/api/auth/callback",
  API_WEBHOOKS: "/api/webhooks",
  API_HEALTH: "/api/health",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * Creates a dynamic route path with parameters.
 *
 * @example
 * buildRoute("/users/:id", { id: "123" }) // "/users/123"
 * buildRoute("/posts/:postId/comments/:commentId", { postId: "5", commentId: "10" })
 * // "/posts/5/comments/10"
 */
export function buildRoute(pattern: string, params: Record<string, string | number>): string {
  let path = pattern;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, String(value));
  }
  return path;
}

/**
 * Checks if a given pathname matches a route (supports dynamic segments).
 *
 * @example
 * matchRoute("/users/123", "/users/:id") // true (params: { id: "123" })
 * matchRoute("/users/123/settings", "/users/:id") // false
 */
export function matchRoute(
  pathname: string,
  pattern: string,
): { matches: boolean; params: Record<string, string> } | false {
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");

  if (patternParts.length !== pathParts.length) return false;

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return false;
    }
  }

  return { matches: true, params };
}

/**
 * Checks if a pathname is an auth route (login, register, etc.).
 */
export function isAuthRoute(pathname: string): boolean {
  const authRoutes = new Set<string>([
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
    ROUTES.VERIFY_EMAIL,
    ROUTES.API_AUTH,
  ]);
  return authRoutes.has(pathname);
}

/**
 * Checks if a pathname is a dashboard route.
 */
export function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith("/dashboard");
}

/**
 * Checks if a pathname is a public route (no auth required).
 * Uses strict equality against a set of known public routes.
 */
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = new Set<string>([
    ROUTES.HOME,
    ROUTES.ABOUT,
    ROUTES.CONTACT,
    ROUTES.PRICING,
    ROUTES.FAQ,
    ROUTES.TERMS,
    ROUTES.PRIVACY,
  ]);
  return publicRoutes.has(pathname);
}
