"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * Theme provider wrapping next-themes.
 *
 * Provides light, dark, and system theme modes to all children.
 * Uses `attribute="class"` for Tailwind CSS dark mode support.
 *
 * Place this at the root of your application inside <html>.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
