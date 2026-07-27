"use client";

/**
 * ErrorFallback — inline error display for sections/components.
 *
 * Used by ErrorBoundary as the default fallback UI. Also usable directly
 * in any section that needs an inline error state.
 *
 * @example
 * <ErrorFallback error={error} onRetry={handleRetry} />
 * <ErrorFallback error={error} onRetry={handleRetry} errorId="ERR-001" />
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { ERROR_MESSAGES } from "../constants";

export interface ErrorFallbackProps {
  /** The error that occurred. */
  error: Error | null;
  /** Callback to retry. */
  onRetry?: () => void;
  /** Optional error tracking ID. */
  errorId?: string;
  /** Optional title override. */
  title?: string;
  /** Custom CSS class. */
  className?: string;
}

export function ErrorFallback({
  error,
  onRetry,
  errorId,
  title,
  className,
}: ErrorFallbackProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center",
        className,
      )}
      role="alert"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>

      <h3 className="text-lg font-semibold text-destructive">
        {title ?? ERROR_MESSAGES.FALLBACK.TITLE}
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {error?.message || ERROR_MESSAGES.FALLBACK.DESCRIPTION}
      </p>

      {errorId && (
        <p className="mt-1 text-xs text-muted-foreground/60">
          {ERROR_MESSAGES.SERVER_ERROR.ERROR_ID_LABEL}: {errorId}
        </p>
      )}

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4 gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {ERROR_MESSAGES.FALLBACK.RETRY}
        </Button>
      )}
    </div>
  );
}
