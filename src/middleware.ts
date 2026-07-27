/**
 * Next.js middleware for authentication and authorization.
 *
 * - Redirects unauthenticated users to the login page for protected routes.
 * - Redirects authenticated users away from auth pages (login, register, etc.).
 * - Enforces role-based access control for dashboard routes.
 * - Excludes public routes (API webhooks, health, etc.) from auth checks.
 */

import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

// ─── Route Classification ─────────────────────────

/** Routes that don't require authentication. */
const PUBLIC_ROUTES = new Set([
  "/",
  "/about",
  "/contact",
  "/pricing",
  "/faq",
  "/terms",
  "/privacy",
]);

/** Auth pages — redirect authenticated users away from these. */
const AUTH_ROUTES = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
]);

/** Routes that require admin role. */
const ADMIN_ROUTES = [
  "/dashboard/users",
  "/dashboard/settings",
];

// ─── Helpers ────────────────────────────────────

/**
 * Check if a pathname starts with any of the given prefixes.
 */
function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Check if a pathname is a protected API route.
 */
function isProtectedApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api") &&
    !pathname.startsWith("/api/auth") &&
    !pathname.startsWith("/api/health") &&
    !pathname.startsWith("/api/webhooks");
}

// ─── Middleware ─────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Skip middleware for static files and Next.js internals ──
  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.startsWith("/favicon")) {
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
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ── 5. Handle public routes ──
  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  // ── 6. Handle dashboard routes (require authentication) ──
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin-only routes
    if (matchesPrefix(pathname, ADMIN_ROUTES) && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // ── 7. Handle protected API routes ──
  if (isProtectedApiRoute(pathname) && !isAuthenticated) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  return NextResponse.next();
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
