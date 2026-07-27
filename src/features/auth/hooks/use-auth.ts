"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

/**
 * Hook for accessing authentication state and methods.
 * Wraps Auth.js useSession with convenience methods.
 *
 * @example
 * const { user, isAuthenticated, isLoading, login, logout } = useAuth();
 */
export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return {
    /** Current user data from session. */
    user: session?.user ?? null,

    /** Whether the user is authenticated. */
    isAuthenticated,

    /** Whether the session is still loading. */
    isLoading,

    /** The full session object. */
    session,

    /**
     * Sign in with credentials.
     *
     * @param email - User email
     * @param password - User password
     * @returns Sign in result
     */
    login: async (email: string, password: string) => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.error) {
        await update();
        router.push(ROUTES.DASHBOARD_HOME);
      }

      return result;
    },

    /**
     * Sign out the current user.
     */
    logout: async () => {
      await signOut({ redirect: false });
      router.push(ROUTES.HOME);
      router.refresh();
    },

    /**
     * Refresh the session (useful after profile updates).
     */
    refreshSession: async () => {
      await update();
    },
  };
}
