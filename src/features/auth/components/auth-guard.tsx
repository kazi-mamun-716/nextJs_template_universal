"use client";

import { useSession } from "@/features/auth/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/constants/routes";
import { LoaderFullPage } from "@/components/ui/loader";

/**
 * Route guard that checks authentication and role-based access.
 * Redirects unauthenticated users to the login page.
 * Shows a 403 page for unauthorized roles.
 *
 * @example
 * // Basic auth protection (any authenticated user)
 * <AuthGuard>
 *   <DashboardPage />
 * </AuthGuard>
 *
 * // Role-based protection (admin only)
 * <AuthGuard allowedRoles={["admin"]}>
 *   <AdminPanel />
 * </AuthGuard>
 */
export function AuthGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  /** Optional array of roles allowed to access the content. */
  allowedRoles?: string[];
}) {
  const { isAuthenticated, isLoading, user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while session is being fetched
  if (isLoading) {
    return <LoaderFullPage message="Verifying authentication..." />;
  }

  // Not authenticated — redirecting
  if (!isAuthenticated) {
    return <LoaderFullPage message="Redirecting to login..." />;
  }

  // Check role-based access
  const userRole = user && typeof user === "object" ? (user as Record<string, unknown>).role as string | undefined : undefined;
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-destructive">403</h1>
          <h2 className="mt-2 text-xl font-semibold">Access Denied</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
