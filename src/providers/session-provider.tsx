"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

/**
 * Auth.js session provider wrapper.
 *
 * Provides the current session to all client components via `useSession()`.
 * Session is fetched client-side after initial page load.
 *
 * @example
 * import { useSession } from "next-auth/react";
 * const { data: session } = useSession();
 */
export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  /** Initial session data from server-side getServerSession */
  session?: Session | null;
}) {
  return (
    <NextAuthSessionProvider session={session} refetchOnWindowFocus={false}>
      {children}
    </NextAuthSessionProvider>
  );
}
