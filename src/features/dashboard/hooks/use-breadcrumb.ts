"use client";

/**
 * useBreadcrumb hook — generates an array of breadcrumb items from the
 * current pathname with human-readable labels.
 *
 * @example
 * const { items } = useBreadcrumb();
 * // items => [{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }, { label: "Settings" }]
 */

import { useMemo } from "react";
import { usePathname } from "next/navigation";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Maps path segments to human-readable labels. */
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  settings: "Settings",
  profile: "Profile",
  users: "Users",
  content: "Content",
  messages: "Messages",
};

function labelize(segment: string): string {
  return (
    SEGMENT_LABELS[segment] ??
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export interface UseBreadcrumbReturn {
  /** Generated breadcrumb items. */
  items: BreadcrumbItem[];
  /** Whether there's more than just the home item. */
  hasBreadcrumb: boolean;
}

export function useBreadcrumb(showHome = true): UseBreadcrumbReturn {
  const pathname = usePathname();

  const items = useMemo<BreadcrumbItem[]>(() => {
    const segments = pathname.split("/").filter(Boolean);
    const crumbs: BreadcrumbItem[] = [];

    if (showHome) {
      crumbs.push({ label: "Home", href: "/" });
    }

    segments.forEach((_, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const segment = segments[index];
      crumbs.push({
        label: labelize(segment),
        href: index < segments.length - 1 ? href : undefined,
      });
    });

    return crumbs;
  }, [pathname, showHome]);

  return {
    items,
    hasBreadcrumb: items.length > (showHome ? 1 : 0),
  };
}
