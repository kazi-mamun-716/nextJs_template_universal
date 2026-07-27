/**
 * Browser storage key constants (localStorage / sessionStorage).
 * Centralizes all storage keys to prevent typos and naming collisions.
 *
 * @example
 * import { STORAGE_KEYS } from "@/constants/storage-keys";
 * localStorage.setItem(STORAGE_KEYS.THEME, "dark");
 * localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
 */

// ─── Local Storage Keys ───────────────────────────────────
export const LOCAL_STORAGE_KEYS = {
  // ─── Auth ────────────────────────────────────────────────
  /** Cached auth token */
  AUTH_TOKEN: "auth_token",
  /** Cached user data */
  USER_DATA: "user_data",

  // ─── Preferences ─────────────────────────────────────────
  /** User theme preference */
  THEME: "theme",
  /** User locale preference */
  LOCALE: "locale",
  /** Sidebar collapsed state */
  SIDEBAR_COLLAPSED: "sidebar_collapsed",
  /** Last viewed dashboard tab */
  DASHBOARD_TAB: "dashboard_tab",

  // ─── Cache ───────────────────────────────────────────────
  /** Cached API responses timestamp */
  CACHE_TIMESTAMP: "cache_timestamp",
  /** Last fetch timestamp for data freshness */
  LAST_FETCH: "last_fetch",
  /** Draft content (unsaved forms, editors) */
  DRAFT_CONTENT: "draft_content",

  // ─── Onboarding ──────────────────────────────────────────
  /** Whether the user has completed onboarding */
  ONBOARDING_COMPLETED: "onboarding_completed",
  /** Last seen tooltip/feature hint */
  LAST_SEEN_HINT: "last_seen_hint",
  /** Dismissed feature announcements */
  DISMISSED_ANNOUNCEMENTS: "dismissed_announcements",

  // ─── Session ─────────────────────────────────────────────
  /** Previous page URL for redirect after login */
  RETURN_URL: "return_url",
  /** Timestamp of last activity for session tracking */
  LAST_ACTIVITY: "last_activity",
} as const;

// ─── Session Storage Keys ─────────────────────────────────
export const SESSION_STORAGE_KEYS = {
  /** Redirect URL after auth flow */
  REDIRECT_URL: "redirect_url",
  /** Form state preserved across page reloads */
  FORM_STATE: "form_state",
  /** Current page scroll position */
  SCROLL_POSITION: "scroll_position",
  /** Active tab in tabbed views */
  ACTIVE_TAB: "active_tab",
} as const;

export type LocalStorageKey = (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS];
export type SessionStorageKey = (typeof SESSION_STORAGE_KEYS)[keyof typeof SESSION_STORAGE_KEYS];

// ─── Storage Helpers ──────────────────────────────────────

/**
 * Generic type-safe storage helper for localStorage.
 *
 * @example
 * import { storage } from "@/constants/storage-keys";
 * storage.set("theme", "dark");
 * const theme = storage.get("theme");
 * storage.remove("theme");
 */
export const storage = {
  get<T = string>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch {
      return localStorage.getItem(key) as unknown as T;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      localStorage.setItem(key, String(value));
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.clear();
  },
};
