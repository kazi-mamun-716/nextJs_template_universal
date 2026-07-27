"use client";

/**
 * MobileNav — mobile-responsive navigation drawer for the dashboard.
 *
 * Slides in from the left with navigation links, user info, and logout.
 *
 * @example
 * <MobileNav
 *   open={mobileOpen}
 *   onClose={() => setMobileOpen(false)}
 *   userName="John Doe"
 *   onLogout={() => signOut()}
 * />
 */

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { X, LayoutDashboard, BarChart3, Settings, User, LogOut } from "lucide-react";
import { DASHBOARD_ROUTES } from "../routes";

export interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface MobileNavProps {
  /** Whether the drawer is open. */
  open: boolean;
  /** Close callback. */
  onClose: () => void;
  /** Navigation items. */
  items?: MobileNavItem[];
  /** User display name. */
  userName?: string | null;
  /** User avatar URL. */
  userImage?: string | null;
  /** Logout callback. */
  onLogout?: () => void;
}

const DEFAULT_ITEMS: MobileNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Analytics", href: "/dashboard/analytics", icon: <BarChart3 className="h-5 w-5" /> },
  { label: "Profile", href: "/dashboard/profile", icon: <User className="h-5 w-5" /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings className="h-5 w-5" /> },
];

export function MobileNav({
  open,
  onClose,
  items = DEFAULT_ITEMS,
  userName,
  userImage,
  onLogout,
}: MobileNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <aside className="relative flex h-full w-72 flex-col border-r bg-card shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 h-16">
          <span className="text-lg font-bold">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User info */}
        {userName && (
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <Avatar src={userImage} name={userName} size="sm" />
            <div>
              <p className="text-sm font-medium">{userName}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        {onLogout && (
          <div className="border-t p-3">
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
            >
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
