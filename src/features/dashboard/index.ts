/**
 * Dashboard Feature — Public API
 *
 * Export surface for all dashboard-related components, hooks, types,
 * and configuration. Import from this barrel instead of deep-importing.
 *
 * @example
 * import { DashboardStats, RecentActivity, useSidebar } from "@/features/dashboard";
 */

// ─── Components ──────────────────────────────────────
export { StatCard, type StatCardProps, type StatCardTrend, StatCardSkeleton } from "./components/stat-card";
export { DashboardStats, type DashboardStatsProps } from "./components/dashboard-stats";
export { WelcomeCard, type WelcomeCardProps } from "./components/welcome-card";
export { RecentActivity, type RecentActivityProps } from "./components/recent-activity";
export { ActivityItem, type ActivityItemProps } from "./components/activity-item";
export { QuickActions, type QuickActionsProps, type QuickAction, QuickActionsSkeleton } from "./components/quick-actions";
export { ProfileMenu, type ProfileMenuProps } from "./components/profile-menu";
export { MobileNav, type MobileNavProps, type MobileNavItem } from "./components/mobile-nav";

// ─── Hooks ───────────────────────────────────────────
export { useSidebar, type UseSidebarReturn } from "./hooks/use-sidebar";
export { useBreadcrumb, type UseBreadcrumbReturn } from "./hooks/use-breadcrumb";

// ─── Types ───────────────────────────────────────────
export type {
  ISidebarItem,
  IBreadcrumbItem,
  IDashboardStats,
} from "./types";

// ─── Constants ───────────────────────────────────────
export { DASHBOARD_MESSAGES } from "./constants";

// ─── Routes ──────────────────────────────────────────
export { DASHBOARD_ROUTES } from "./routes";
export type { DashboardRoute } from "./routes";

// ─── Config ──────────────────────────────────────────
export { dashboardFeatureConfig } from "./config";
