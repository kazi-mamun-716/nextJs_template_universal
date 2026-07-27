/**
 * Theme feature configuration.
 */
export const themeFeatureConfig = {
  defaultTheme: "system" as const,
  themes: ["light", "dark", "system"] as const,
  storageKey: "theme",
} as const;
