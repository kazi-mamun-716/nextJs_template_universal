"use client";

/**
 * ErrorContent — reusable 500 error page content.
 *
 * Displays a 500 status with error message, tracking ID,
 * retry button, and home link. Integrates with the error
 * logger to capture the error.
 *
 * @example
 * <ErrorContent error={error} reset={reset} />
 * <ErrorContent error={error} reset={reset} errorId="ERR-001" />
 */

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { ERROR_MESSAGES } from "../constants";
import { errorLogger } from "../services/error-logger";

export interface ErrorContentProps {
  /** The error that occurred. */
  error: Error & { digest?: string };
  /** Next.js reset function to retry. */
  reset: () => void;
  /** Optional pre-generated error ID. */
  errorId?: string;
  /** Custom CSS class. */
  className?: string;
}

export function ErrorContent({ error, reset, errorId: externalErrorId, className }: ErrorContentProps) {
  const [errorId] = React.useState(() => externalErrorId ?? errorLogger.generateErrorId());

  // Log the error on mount
  React.useEffect(() => {
    errorLogger.capture(error, {
      level: "error",
      source: "ErrorPage",
      code: "INTERNAL_ERROR",
      context: { digest: error.digest },
    });
  }, [error]);

  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      {/* Large 500 visual */}
      <div className="relative mb-8">
        <div className="text-[120px] font-bold leading-none tracking-tighter text-destructive/10 select-none sm:text-[180px]">
          500
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </div>
      </div>

      {/* Title & description */}
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {ERROR_MESSAGES.SERVER_ERROR.TITLE}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        {error.message || ERROR_MESSAGES.SERVER_ERROR.DESCRIPTION}
      </p>

      {/* Error ID */}
      <div className="mt-6 rounded-md bg-muted px-4 py-2">
        <p className="text-xs text-muted-foreground">
          {ERROR_MESSAGES.SERVER_ERROR.ERROR_ID_LABEL}:{" "}
          <span className="font-mono font-medium text-foreground">{errorId}</span>
        </p>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex items-center gap-3">
        <Button variant="outline" onClick={reset} className="gap-1.5">
          <RefreshCw className="h-4 w-4" />
          {ERROR_MESSAGES.SERVER_ERROR.TRY_AGAIN}
        </Button>
        <Link href="/">
          <Button className="gap-1.5">
            <Home className="h-4 w-4" />
            {ERROR_MESSAGES.SERVER_ERROR.GO_HOME}
          </Button>
        </Link>
      </div>
    </div>
  );
}
