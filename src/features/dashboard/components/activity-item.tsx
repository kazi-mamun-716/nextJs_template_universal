"use client";

/**
 * ActivityItem — a single entry in the recent activity feed.
 *
 * @example
 * <ActivityItem
 *   icon={<UserPlus className="h-4 w-4" />}
 *   color="blue"
 *   description="New user registered"
 *   timestamp="2026-07-27T10:30:00Z"
 *   user="John Doe"
 * />
 */

import React from "react";
import { cn } from "@/lib/utils";

export interface ActivityItemProps {
  /** Icon element. */
  icon: React.ReactNode;
  /** Color accent for the icon background. */
  color?: "blue" | "green" | "amber" | "purple" | "rose" | "gray";
  /** Activity description. */
  description: string;
  /** ISO timestamp string. */
  timestamp: string;
  /** Optional user who performed the action. */
  user?: string;
  /** Optional link href. */
  href?: string;
  /** Custom CSS class. */
  className?: string;
}

const colorVariants: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
  gray: "bg-muted text-muted-foreground",
};

function timeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function ActivityItem({
  icon,
  color = "gray",
  description,
  timestamp,
  user,
  href,
  className,
}: ActivityItemProps) {
  const content = (
    <div className={cn("group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50", className)}>
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", colorVariants[color])}>
        {icon}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm">
          {description}
          {user && (
            <span className="font-medium text-foreground"> by {user}</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">{timeAgo(timestamp)}</p>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} className="block">{content}</a>;
  }

  return content;
}
