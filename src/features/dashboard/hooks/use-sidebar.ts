"use client";

/**
 * Hook for managing sidebar state (collapsed/expanded, mobile).
 */
export function useSidebar() {
  return {
    isCollapsed: false,
    isMobileOpen: false,
    toggle: () => {},
    close: () => {},
  };
}
