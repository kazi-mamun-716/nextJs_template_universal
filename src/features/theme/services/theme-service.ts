/**
 * Theme service — handles theme-related business logic.
 */
export const themeService = {
  getPreferredTheme(): "light" | "dark" | "system" {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("theme") as "light" | "dark" | "system") ?? "system";
  },

  setPreferredTheme(theme: "light" | "dark" | "system"): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("theme", theme);
  },
};
