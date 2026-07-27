import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { PageHeader } from "@/components/layout/page-header";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { WelcomeCard } from "@/features/dashboard/components/welcome-card";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import {
  Users,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";

export const metadata = {
  title: "Dashboard",
  description: "Your dashboard overview",
};

const QUICK_ACTIONS = [
  { label: "View Users", icon: <Users className="h-5 w-5" />, href: "/dashboard/users", description: "Manage users" },
  { label: "Analytics", icon: <BarChart3 className="h-5 w-5" />, href: "/dashboard/analytics", description: "View insights" },
  { label: "Content", icon: <FileText className="h-5 w-5" />, href: "/dashboard/content", description: "Manage pages" },
  { label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/dashboard/settings", description: "Configure app" },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect(ROUTES.LOGIN);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome to your dashboard overview."
      />

      {/* Welcome Card */}
      <WelcomeCard
        userName={session.user.name}
        userEmail={session.user.email}
        userImage={session.user.image}
      />

      {/* Stats Grid */}
      <DashboardStats />

      {/* Quick Actions */}
      <QuickActions actions={QUICK_ACTIONS} />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
