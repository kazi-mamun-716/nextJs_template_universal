import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Breadcrumb } from "@/components/layout/breadcrumb";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Profile", href: "/dashboard/profile" },
];

/**
 * Dashboard layout with sidebar, navbar, breadcrumb, and main content area.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar items={sidebarItems} />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="flex-1 space-y-4 p-6 lg:p-8">
          <Breadcrumb />
          {children}
        </div>
      </div>
    </div>
  );
}
