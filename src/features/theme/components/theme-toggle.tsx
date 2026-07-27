"use client";

import { useTheme } from "next-themes";

/**
 * Theme toggle button for switching between light, dark, and system modes.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Toggle Theme</button>;
}
