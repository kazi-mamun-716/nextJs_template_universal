"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProvider } from "@/providers/session-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { ConfirmProvider } from "@/providers/confirm-provider";
import { LoadingProvider } from "@/providers/loading-provider";
import type { Session } from "next-auth";

interface ProvidersProps {
  children: React.ReactNode;
  /** Initial session from server-side getServerSession */
  session?: Session | null;
}

/**
 * Root provider composition.
 *
 * Order matters — inner providers can consume outer providers:
 * 1. ThemeProvider — provides theme context (outermost, no deps)
 * 2. SessionProvider — provides auth session
 * 3. ConfirmProvider — uses Dialog (needs theme for styling)
 * 4. LoadingProvider — standalone loading overlay
 * 5. ToastProvider — renders outside children tree (standalone)
 *
 * @example
 * // app/layout.tsx
 * import { Providers } from "@/providers";
 *
 * export default function RootLayout({ children }) {
 *   return <Providers>{children}</Providers>;
 * }
 */
export function Providers({ children, session }: ProvidersProps) {
  return (
    <ThemeProvider>
      <SessionProvider session={session}>
        <ConfirmProvider>
          <LoadingProvider>
            {children}
            <ToastProvider />
          </LoadingProvider>
        </ConfirmProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
