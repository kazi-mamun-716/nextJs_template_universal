"use client";

/**
 * StatCard — displays a single metric with icon, value, label, and trend.
 *
 * @example
 * <StatCard
 *   title="Total Users"
 *   value="2,847"
 *   icon={<Users className="h-5 w-5" />}
 *   trend={{ value: 12, isPositive: true }}
 *   color="blue"
 * />
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface StatCardTrend {
  value: number;
  isPositive: boolean;
}

export interface StatCardProps {
  /** Metric title / label. */
  title: string;
  /** Formatted value string. */
  value: string;
  /** Optional icon element. */
  icon?: React.ReactNode;
  /** Optional trend indicator. */
  trend?: StatCardTrend;
  /** Color accent for the icon background. */
  color?: "blue" | "green" | "amber" | "purple" | "rose" | "indigo";
  /** Optional description shown below the value. */
  description?: string;
  /** Custom CSS class. */
  className?: string;
}

const colorVariants: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
  green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" },
  amber: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
  rose: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600 dark:text-rose-400" },
  indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400" },
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  color = "blue",
  description,
  className,
}: StatCardProps) {
  const colors = colorVariants[color] ?? colorVariants.blue;

  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {icon && (
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", colors.bg)}>
              <span className={colors.text}>{icon}</span>
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-1.5 text-sm">
            {trend.value === 0 ? (
              <Minus className="h-4 w-4 text-muted-foreground" />
            ) : trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span
              className={cn(
                "font-medium",
                trend.value === 0
                  ? "text-muted-foreground"
                  : trend.isPositive
                    ? "text-green-600"
                    : "text-red-600",
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * StatCardSkeleton — loading placeholder for StatCard.
 */
export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
