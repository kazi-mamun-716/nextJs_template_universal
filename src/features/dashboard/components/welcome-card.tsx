"use client";

/**
 * WelcomeCard — greeting card for the dashboard home.
 *
 * Shows a personalized welcome message with user info,
 * last login time, and contextual tips.
 *
 * @example
 * <WelcomeCard
 *   userName="John"
 *   userEmail="john@example.com"
 *   lastLogin="2026-07-26T10:30:00Z"
 * />
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Sparkles, Clock } from "lucide-react";
import { DASHBOARD_MESSAGES } from "../constants";

export interface WelcomeCardProps {
  /** User's display name. */
  userName?: string | null;
  /** User's email address. */
  userEmail?: string | null;
  /** User's avatar URL. */
  userImage?: string | null;
  /** Last login ISO timestamp. */
  lastLogin?: string | null;
  /** Custom CSS class. */
  className?: string;
}

function formatLastLogin(isoString?: string | null): string {
  if (!isoString) return "—";
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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function WelcomeCard({
  userName,
  userEmail,
  userImage,
  lastLogin,
  className,
}: WelcomeCardProps) {
  const greeting = getGreeting();

  return (
    <Card className={cn("bg-gradient-to-br from-primary/5 via-primary/0 to-background", className)}>
      <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <Avatar
          src={userImage}
          name={userName ?? "User"}
          size="xl"
        />
        <div className="flex-1 space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {greeting}, {userName ?? "there"}!
          </h2>
          <p className="text-sm text-muted-foreground">
            {userEmail ?? DASHBOARD_MESSAGES.WELCOME}
          </p>
          {lastLogin && (
            <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Last login: {formatLastLogin(lastLogin)}
            </div>
          )}
        </div>
        <div className="hidden rounded-full bg-primary/10 p-2 sm:block">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
