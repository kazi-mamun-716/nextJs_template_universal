/**
 * Next.js middleware for authentication, authorization, and security headers.
 *
 * - Applies security headers to all responses.
 * - Redirects unauthenticated users to the login page for protected routes.
 * - Redirects authenticated users away from auth pages (login, register, etc.).
 * - Enforces role-based access control for dashboard routes.
 * - Excludes public routes (API webhooks, health, etc.) from auth checks.
 */

import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import { buildSecurityHeaders, securityHeadersToRecord } from "@/features/security";
import { ROUTES } from "@/constants/routes";

// ─── Route Classification ─────────────────────────

/** Routes that don't require authentication. */
const PUBLIC_ROUTES: ReadonlySet<string> = new Set([
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.CONTACT,
  ROUTES.PRICING,
  ROUTES.FAQ,
  ROUTES.TERMS,
  ROUTES.PRIVACY,
]);

/** Auth pages — redirect authenticated users away from these. */
const AUTH_ROUTES: ReadonlySet<string> = new Set([
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.VERIFY_EMAIL,
]);

/** Routes that require admin role. */
const ADMIN_ROUTES: readonly string[] = [ROUTES.DASHBOARD_USERS, ROUTES.DASHBOARD_SETTINGS];

// ─── Helpers ────────────────────────────────────

/**
 * Check if a pathname starts with any of the given prefixes.
 */
function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Check if a pathname is a protected API route.
 */
function isProtectedApiRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/api") &&
    !pathname.startsWith("/api/auth") &&
    !pathname.startsWith("/api/health") &&
    !pathname.startsWith("/api/webhooks")
  );
}

/**
 * Build the security headers record once.
 * Using a lazy-loaded singleton pattern to avoid rebuilding on every request.
 */
let cachedSecurityHeaders: Record<string, string> | null = null;
function getSecurityHeaders(): Record<string, string> {
  if (!cachedSecurityHeaders) {
    cachedSecurityHeaders = securityHeadersToRecord(buildSecurityHeaders());
  }
  return cachedSecurityHeaders;
}

/**
 * Apply security headers to a NextResponse.
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// ─── Middleware ─────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Skip middleware for static files and Next.js internals ──
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // ── 2. Skip auth API routes to prevent Auth.js request loops ──
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // ── 3. Get session ──
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role;

  // ── 4. Handle auth routes (login, register, etc.) ──
  if (AUTH_ROUTES.has(pathname)) {
    if (isAuthenticated) {
      return applySecurityHeaders(NextResponse.redirect(new URL("/dashboard", request.url)));
    }
    return applySecurityHeaders(NextResponse.next());
  }

  // ── 5. Handle public routes ──
  if (PUBLIC_ROUTES.has(pathname)) {
    return applySecurityHeaders(NextResponse.next());
  }

  // ── 6. Handle dashboard routes (require authentication) ──
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    // Check admin-only routes
    if (matchesPrefix(pathname, ADMIN_ROUTES) && userRole !== "admin") {
      return applySecurityHeaders(NextResponse.redirect(new URL("/dashboard", request.url)));
    }

    return applySecurityHeaders(NextResponse.next());
  }

  // ── 7. Handle protected API routes ──
  if (isProtectedApiRoute(pathname) && !isAuthenticated) {
    return applySecurityHeaders(
      NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }),
    );
  }

  return applySecurityHeaders(NextResponse.next());
}

/**
 * Middleware matcher configuration.
 * Only runs on matching routes for performance.
 */
export const config = {
  matcher: [
    // Match all routes except static files, Next.js internals, and public assets
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
