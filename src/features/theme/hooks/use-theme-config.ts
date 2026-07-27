"use client";

import { useTheme } from "next-themes";

/**
 * Hook for accessing extended theme configuration.
 */
export function useThemeConfig() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();

  return {
    theme,
    setTheme,
    systemTheme,
    resolvedTheme,
    isDark: resolvedTheme === "dark",
    isLight: resolvedTheme === "light",
    isSystem: theme === "system",
  };
}
