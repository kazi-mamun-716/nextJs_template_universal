"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Spinner Loader ──────────────────────────────────────

export interface LoaderSpinnerProps {
  /** Size of the spinner */
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Spinning loader indicator.
 *
 * @example
 * <LoaderSpinner />
 * <LoaderSpinner size="lg" className="text-primary" />
 */
export function LoaderSpinner({ size = "md", className }: LoaderSpinnerProps) {
  const sizeClasses: Record<string, string> = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-current border-t-transparent text-muted-foreground",
        sizeClasses[size] ?? sizeClasses.md,
        className,
      )}
    />
  );
}

// ─── Dots Loader ─────────────────────────────────────────

export interface LoaderDotsProps {
  className?: string;
}

/**
 * Animated bouncing dots loader.
 *
 * @example
 * <LoaderDots />
 */
export function LoaderDots({ className }: LoaderDotsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// ─── Progress Bar ────────────────────────────────────────

export interface LoaderProgressProps {
  /** Progress value (0-100) */
  value?: number;
  /** Whether to show indeterminate animation */
  indeterminate?: boolean;
  className?: string;
}

/**
 * Progress bar loader (determinate or indeterminate).
 *
 * @example
 * <LoaderProgress value={65} />
 * <LoaderProgress indeterminate />
 */
export function LoaderProgress({ value = 0, indeterminate = false, className }: LoaderProgressProps) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={
          indeterminate
            ? {
                width: "40%",
                animation: "loader-indeterminate 1.5s ease-in-out infinite",
              }
            : { width: `${Math.min(100, Math.max(0, value))}%` }
        }
      />
    </div>
  );
}

// ─── Full Page Loader ────────────────────────────────────

export interface LoaderFullPageProps {
  /** Optional message to display below the spinner */
  message?: string;
}

/**
 * Full-page loading overlay with optional message.
 *
 * @example
 * <LoaderFullPage message="Loading dashboard..." />
 */
export function LoaderFullPage({ message }: LoaderFullPageProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
      <LoaderSpinner size="lg" />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
}
