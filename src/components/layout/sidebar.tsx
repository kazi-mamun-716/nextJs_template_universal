"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  BarChart3,
  Settings,
  User,
  Users,
  FileText,
  MessageSquare,
  Bell,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────

export interface SidebarItem {
  /** Display label */
  label: string;
  /** Route path */
  href: string;
  /** Lucide icon name (or custom icon node) */
  icon?: React.ReactNode;
  /** Badge count (e.g., notification count) */
  badge?: number;
  /** Nested children for sub-navigation */
  children?: SidebarItem[];
}

interface SidebarProps {
  /** Sidebar navigation items */
  items?: SidebarItem[];
  /** Brand/logo shown at the top */
  brand?: React.ReactNode;
  /** Whether the sidebar starts collapsed (desktop only) */
  defaultCollapsed?: boolean;
  /** Callback when logout is clicked */
  onLogout?: () => void;
  /** User name displayed at the bottom */
  userName?: string;
  className?: string;
}

// ─── Icon Map ───────────────────────────────────────────

const defaultIcons: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="h-4 w-4" />,
  analytics: <BarChart3 className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
  profile: <User className="h-4 w-4" />,
  users: <Users className="h-4 w-4" />,
  content: <FileText className="h-4 w-4" />,
  messages: <MessageSquare className="h-4 w-4" />,
  notifications: <Bell className="h-4 w-4" />,
};

// ─── Component ──────────────────────────────────────────

/**
 * Collapsible sidebar navigation with icon support, active states, and badge counts.
 *
 * @example
 * <Sidebar
 *   items={[
 *     { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard /> },
 *     { label: "Settings", href: "/dashboard/settings", icon: <Settings /> },
 *   ]}
 *   userName="John Doe"
 * />
 */
export function Sidebar({
  items = [],
  brand,
  defaultCollapsed = false,
  onLogout,
  userName,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo / Brand */}
      <div className={cn("flex h-16 items-center border-b px-4", collapsed ? "justify-center" : "justify-between")}>
        {collapsed ? (
          brand ? (
            <div className="scale-75">{brand}</div>
          ) : (
            <span className="text-lg font-bold">N</span>
          )
        ) : (
          brand ?? <span className="text-lg font-bold">NextPlate</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active = isActive(item.href);
          const icon = item.icon ?? defaultIcons[item.label.toLowerCase()];

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-2",
                )}
              >
                {icon && <span className="shrink-0">{icon}</span>}
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className={cn("border-t p-3", collapsed && "flex flex-col items-center gap-2")}>
        {userName && (
          <div className={cn("flex items-center gap-3 rounded-md px-3 py-2", collapsed && "px-2")}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 truncate">
                <p className="text-sm font-medium">{userName}</p>
              </div>
            )}
          </div>
        )}
        {onLogout && (
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            className={cn("w-full", collapsed && "w-8")}
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Log out</span>}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex md:flex-col",
          "relative border-r bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          className,
        )}
      >
        {sidebarContent}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar (drawer) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-64 border-r bg-card">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Mobile toggle button (shown outside sidebar) */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:hidden"
      >
        {mobileOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
      </button>
    </>
  );
}
