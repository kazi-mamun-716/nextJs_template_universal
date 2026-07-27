"use client";

/**
 * QuickActions — grid of shortcut buttons for common dashboard tasks.
 *
 * @example
 * <QuickActions
 *   actions={[
 *     { label: "New User", icon: <UserPlus />, href: "/dashboard/users/new" },
 *     { label: "Analytics", icon: <BarChart3 />, href: "/dashboard/analytics" },
 *   ]}
 * />
 */

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface QuickAction {
  /** Action label. */
  label: string;
  /** Icon element. */
  icon: React.ReactNode;
  /** Route path or external URL. */
  href: string;
  /** Optional description. */
  description?: string;
}

export interface QuickActionsProps {
  /** List of quick actions. */
  actions: QuickAction[];
  /** Custom CSS class. */
  className?: string;
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all hover:border-primary hover:bg-accent hover:shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:text-foreground">
                {action.icon}
              </div>
              <span className="text-sm font-medium">{action.label}</span>
              {action.description && (
                <span className="text-xs text-muted-foreground">{action.description}</span>
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton loading state for QuickActions.
 */
export function QuickActionsSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 rounded-lg border p-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
