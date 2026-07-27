"use client";

/**
 * RecentActivity — displays a feed of recent user actions and system events.
 *
 * @example
 * <RecentActivity
 *   items={[
 *     { description: "New user registered", timestamp: "2026-07-27T10:30:00Z", color: "green", icon: <UserPlus /> },
 *   ]}
 * />
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityItem, type ActivityItemProps } from "./activity-item";
import { DASHBOARD_MESSAGES } from "../constants";
import { RefreshCw, UserPlus, FileEdit, Settings, LogIn, AlertCircle } from "lucide-react";

export interface RecentActivityProps {
  /** Custom activity items. Uses sample data if not provided. */
  items?: ActivityItemProps[];
  /** Whether data is still loading. */
  isLoading?: boolean;
  /** Custom CSS class. */
  className?: string;
}

const DEFAULT_ACTIVITIES: ActivityItemProps[] = [
  {
    icon: <UserPlus className="h-4 w-4" />,
    color: "green",
    description: "New user registered",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    user: "jane@example.com",
  },
  {
    icon: <FileEdit className="h-4 w-4" />,
    color: "blue",
    description: "Content updated",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    user: "Admin",
  },
  {
    icon: <Settings className="h-4 w-4" />,
    color: "amber",
    description: "System settings changed",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    user: "Admin",
  },
  {
    icon: <LogIn className="h-4 w-4" />,
    color: "purple",
    description: "User logged in from new device",
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    user: "john@example.com",
  },
  {
    icon: <AlertCircle className="h-4 w-4" />,
    color: "rose",
    description: "Failed login attempt detected",
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

export function RecentActivity({
  items = DEFAULT_ACTIVITIES,
  isLoading = false,
  className,
}: RecentActivityProps) {
  const [visibleCount, setVisibleCount] = React.useState(5);
  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        {!isLoading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVisibleCount(5)}
            className="gap-1.5 text-muted-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {DASHBOARD_MESSAGES.NO_DATA}
          </p>
        ) : (
          <>
            <div className="divide-y">
              {visibleItems.map((item, index) => (
                <ActivityItem key={index} {...item} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-3 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisibleCount(visibleCount + 5)}
                  className="text-muted-foreground"
                >
                  Show {Math.min(5, items.length - visibleCount)} more
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
