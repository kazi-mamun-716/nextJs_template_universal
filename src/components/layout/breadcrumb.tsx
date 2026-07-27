"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

// ─── Types ──────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  /** Override auto-generated items */
  items?: BreadcrumbItem[];
  /** Whether to show the home icon */
  showHome?: boolean;
  /** Home label override */
  homeLabel?: string;
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────

/** Maps path segments to human-readable labels */
const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  settings: "Settings",
  profile: "Profile",
  users: "Users",
  content: "Content",
  messages: "Messages",
  login: "Log in",
  register: "Sign up",
  "forgot-password": "Forgot Password",
  "reset-password": "Reset Password",
};

function labelize(segment: string): string {
  return segmentLabels[segment] ?? segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ─── Component ──────────────────────────────────────────

/**
 * Breadcrumb navigation with auto-generation from pathname.
 *
 * @example
 * // Auto-generates from current path: /dashboard/settings
 * <Breadcrumb />
 *
 * // Manual items
 * <Breadcrumb items={[
 *   { label: "Home", href: "/" },
 *   { label: "Settings" },
 * ]} />
 */
export function Breadcrumb({ items, showHome = true, homeLabel, className }: BreadcrumbProps) {
  const pathname = usePathname();

  const breadcrumbs: BreadcrumbItem[] = React.useMemo(() => {
    if (items) return items;

    const segments = pathname.split("/").filter(Boolean);
    const crumbs: BreadcrumbItem[] = [];

    if (showHome) {
      crumbs.push({ label: homeLabel ?? "Home", href: "/" });
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
  }, [pathname, items, showHome, homeLabel]);

  if (breadcrumbs.length <= 1 && !showHome) return null;

  return (
    <nav className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)} aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors hover:text-foreground"
            >
              {index === 0 && showHome && <Home className="h-3.5 w-3.5" />}
              {crumb.label}
            </Link>
          ) : (
            <span className="flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-foreground">
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
