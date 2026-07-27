/**
 * Dashboard feature type definitions.
 */
export interface ISidebarItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: ISidebarItem[];
}

export interface IBreadcrumbItem {
  label: string;
  href?: string;
}

export interface IDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  pendingTasks: number;
}
