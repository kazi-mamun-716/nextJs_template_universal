"use client";

/**
 * ErrorBoundary — React Error Boundary component.
 *
 * Catches JavaScript errors in its child component tree and displays
 * a fallback UI instead of crashing the whole page. Logs errors to
 * the error logger and supports recovery via retry.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <DashboardStats />
 * </ErrorBoundary>
 *
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <Widget />
 * </ErrorBoundary>
 * ```
 */

import React from "react";
import { errorLogger } from "../services/error-logger";
import { ErrorFallback } from "./error-fallback";
import type { ErrorBoundaryState, ErrorLevel } from "../types";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Custom fallback UI. Receives error, reset, and errorId. */
  fallback?: React.ReactNode | ((props: { error: Error; reset: () => void; errorId?: string }) => React.ReactNode);
  /** The error source name for logging. */
  source?: string;
  /** Error severity level. */
  level?: ErrorLevel;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private errorId: string | undefined;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      metadata: null,
    };
    this.errorId = undefined;
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Generate stable error ID on first catch
    this.errorId = errorLogger.generateErrorId();

    // Log the error with component stack trace
    const metadata = errorLogger.capture(error, {
      level: this.props.level ?? "error",
      source: this.props.source ?? "ErrorBoundary",
      code: "BOUNDARY_ERROR",
      context: {
        errorId: this.errorId,
        componentStack: info.componentStack ?? undefined,
      },
    });

    this.setState({ metadata });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, metadata: null });
    this.errorId = undefined;
  };

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { error, metadata } = this.state;
    const errorId = metadata ? this.errorId : undefined;

    // Use custom fallback if provided
    if (this.props.fallback) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback({
          error: error!,
          reset: this.handleReset,
          errorId,
        });
      }
      return this.props.fallback;
    }

    // Default fallback
    return (
      <ErrorFallback
        error={error!}
        onRetry={this.handleReset}
        errorId={errorId}
      />
    );
  }
}
