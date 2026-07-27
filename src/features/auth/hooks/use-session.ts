"use client";

import { useSession as useNextAuthSession } from "next-auth/react";

/**
 * Hook for accessing the current user session with typed data.
 * Thin wrapper around Auth.js useSession for consistent typing.
 *
 * @example
 * const { session, user, isLoading } = useSession();
 * if (user?.role === "admin") { ... }
 */
export function useSession() {
  const { data: session, status, update } = useNextAuthSession();

  return {
    /** The full session object from Auth.js. */
    session,

    /** Current user with typed fields (id, name, email, role, image). */
    user: session?.user ?? null,

    /** Whether the session is still loading. */
    isLoading: status === "loading",

    /** Whether the user is authenticated. */
    isAuthenticated: status === "authenticated",

    /** Whether the user is not authenticated. */
    isUnauthenticated: status === "unauthenticated",

    /** Refresh the session data from the server. */
    refresh: async () => {
      await update();
    },
  };
}
