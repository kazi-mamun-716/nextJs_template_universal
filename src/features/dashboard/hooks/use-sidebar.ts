"use client";

/**
 * useSidebar hook — manages sidebar collapse state and mobile visibility.
 *
 * Persists the collapsed state to localStorage so the user's preference
 * is remembered across sessions.
 *
 * @example
 * const { collapsed, toggle, mobileOpen, openMobile, closeMobile } = useSidebar();
 */

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "sidebar_collapsed";

export interface UseSidebarReturn {
  /** Whether the sidebar is collapsed on desktop. */
  collapsed: boolean;
  /** Toggle the collapsed state. */
  toggle: () => void;
  /** Set collapsed state explicitly. */
  setCollapsed: (value: boolean) => void;
  /** Whether the mobile drawer is open. */
  mobileOpen: boolean;
  /** Open the mobile drawer. */
  openMobile: () => void;
  /** Close the mobile drawer. */
  closeMobile: () => void;
}

export function useSidebar(defaultCollapsed = false): UseSidebarReturn {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setCollapsed(stored === "true");
      }
    }
  }, []);

  // Persist collapsed state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    }
  }, [collapsed]);

  const toggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const openMobile = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return {
    collapsed,
    toggle,
    setCollapsed,
    mobileOpen,
    openMobile,
    closeMobile,
  };
}
