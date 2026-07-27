"use client";

/**
 * DashboardStats — metrics grid for the dashboard overview.
 *
 * Displays key metrics in a responsive grid using StatCard components.
 * In a real application, data would come from a server action or API.
 *
 * @example
 * <DashboardStats
 *   stats={[
 *     { title: "Total Users", value: "2,847", trend: { value: 12, isPositive: true }, color: "blue" },
 *   ]}
 * />
 */

import React from "react";
import { Users, TrendingUp, DollarSign, Clock } from "lucide-react";
import { StatCard, StatCardSkeleton, type StatCardProps } from "./stat-card";

export interface DashboardStatsProps {
  /** Custom stats override. Uses sample data if not provided. */
  stats?: StatCardProps[];
  /** Whether data is still loading. */
  isLoading?: boolean;
}

/**
 * Sample stats for demonstration purposes.
 * Replace these with real data from your server actions / API.
 */
const DEFAULT_STATS: StatCardProps[] = [
  {
    title: "Total Users",
    value: "2,847",
    icon: <Users className="h-5 w-5" />,
    trend: { value: 12, isPositive: true },
    color: "blue",
    description: "All registered accounts",
  },
  {
    title: "Active Users",
    value: "1,423",
    icon: <TrendingUp className="h-5 w-5" />,
    trend: { value: 8, isPositive: true },
    color: "green",
    description: "Active in last 30 days",
  },
  {
    title: "Revenue",
    value: "$48,290",
    icon: <DollarSign className="h-5 w-5" />,
    trend: { value: 3, isPositive: false },
    color: "amber",
    description: "Total revenue this month",
  },
  {
    title: "Pending Tasks",
    value: "24",
    icon: <Clock className="h-5 w-5" />,
    trend: { value: 0, isPositive: false },
    color: "purple",
    description: "Awaiting action",
  },
];

export function DashboardStats({ stats = DEFAULT_STATS, isLoading = false }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
