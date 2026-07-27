/**
 * Theme-related type definitions.
 *
 * These types define theming across the entire application.
 *
 * @example
 * import type { ThemeMode, ThemeConfig } from "@/types/theme";
 */

// ─── Theme Mode ──────────────────────────────────────────

/** Supported theme modes. */
export type ThemeMode = "light" | "dark" | "system";

/** Resolved theme (system preference evaluated). */
export type ResolvedTheme = "light" | "dark";

// ─── Theme Config ────────────────────────────────────────

/** Theme configuration object. */
export interface ThemeConfig {
  /** Current theme mode. */
  mode: ThemeMode;
  /** Primary color in HSL or hex format. */
  primaryColor?: string;
  /** Border radius scale in pixels. */
  borderRadius?: number;
  /** Font family override. */
  fontFamily?: string;
}

/** CSS variable map for theme injection. */
export type ThemeCSSVariables = Record<string, string>;

// ─── Color Scheme ────────────────────────────────────────

/** HSL color value (hue, saturation, lightness). */
export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

/** Complete color palette for a theme. */
export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
}

// ─── Responsive ──────────────────────────────────────────

/** Standard breakpoint keys. */
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/** Responsive value type (value per breakpoint). */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
