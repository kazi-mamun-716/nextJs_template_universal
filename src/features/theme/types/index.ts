/**
 * Theme feature type definitions.
 */
export type ThemeMode = "light" | "dark" | "system";

export interface IThemeConfig {
  mode: ThemeMode;
  primaryColor?: string;
  borderRadius?: number;
}
