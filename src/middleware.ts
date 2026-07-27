export { auth as middleware } from "@/lib/auth";

/**
 * Middleware matcher configuration.
 * Only runs on matching routes for performance.
 */
export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",
    // API routes (exclude auth and webhooks)
    "/api/:path*",
  ],
};
