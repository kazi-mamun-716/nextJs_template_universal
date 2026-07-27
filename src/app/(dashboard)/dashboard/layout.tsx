import { Sidebar, DashboardNavbar } from "@/features/dashboard";

/**
 * Dashboard layout with sidebar and navbar.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <DashboardNavbar />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
