/**
 * Dashboard Feature — Public API
 */

// Components
export { Sidebar } from "./components/sidebar";
export { DashboardNavbar } from "./components/navbar";
export { Breadcrumb } from "./components/breadcrumb";
export { ProfileMenu } from "./components/profile-menu";
export { DashboardStats } from "./components/dashboard-stats";
export { RecentActivity } from "./components/recent-activity";
export { MobileNav } from "./components/mobile-nav";

// Hooks
export { useSidebar } from "./hooks/use-sidebar";
export { useBreadcrumb } from "./hooks/use-breadcrumb";

// Types
export type { ISidebarItem, IBreadcrumbItem, IDashboardStats } from "./types";

// Constants & Routes
export { DASHBOARD_MESSAGES } from "./constants";
export { DASHBOARD_ROUTES } from "./routes";
export type { DashboardRoute } from "./routes";

// Config
export { dashboardFeatureConfig } from "./config";
