import { DashboardStats, RecentActivity } from "@/features/dashboard";
import { PageHeader } from "@/components/layout/page-header";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Welcome to your dashboard overview." />
      <DashboardStats />
      <RecentActivity />
    </div>
  );
}
