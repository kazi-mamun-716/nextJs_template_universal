"use client";

/**
 * Hook for generating breadcrumb items based on current route.
 */
export function useBreadcrumb() {
  return {
    items: [] as { label: string; href?: string }[],
  };
}
