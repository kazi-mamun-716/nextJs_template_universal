import type { ISidebarItem } from "@/features/dashboard/types";

/**
 * Dashboard feature configuration.
 */
export const dashboardFeatureConfig = {
  sidebar: {
    defaultCollapsed: false,
    width: 280,
    collapsedWidth: 64,
  },
  navigation: {
    items: [
      { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
      { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
      { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
      { label: "Profile", href: "/dashboard/profile", icon: "User" },
    ] as ISidebarItem[],
  },
} as const;
