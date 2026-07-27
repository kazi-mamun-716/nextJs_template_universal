"use client";

/**
 * GlobalErrorContent — standalone error UI for the global error page.
 *
 * Unlike ErrorContent, this component is fully self-contained (no
 * dependencies on the app layout) because global-error.tsx replaces
 * the entire root layout with its own <html> and <body> tags.
 *
 * @example
 * <GlobalErrorContent error={error} reset={reset} />
 */

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { ERROR_MESSAGES } from "../constants";

export interface GlobalErrorContentProps {
  /** The error that occurred. */
  error: Error & { digest?: string };
  /** Reset function to retry. */
  reset: () => void;
}

export function GlobalErrorContent({ error, reset }: GlobalErrorContentProps) {
  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          height: "5rem",
          width: "5rem",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "1rem",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          marginBottom: "2rem",
        }}
      >
        <AlertTriangle style={{ height: "2.5rem", width: "2.5rem", color: "#ef4444" }} />
      </div>

      <h1
        style={{
          fontSize: "1.875rem",
          fontWeight: 700,
          letterSpacing: "-0.025em",
          color: "#18181b",
          margin: 0,
        }}
      >
        {ERROR_MESSAGES.CRITICAL.TITLE}
      </h1>

      <p
        style={{
          marginTop: "0.75rem",
          maxWidth: "28rem",
          color: "#71717a",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
      >
        {error.message || ERROR_MESSAGES.CRITICAL.DESCRIPTION}
      </p>

      <button
        onClick={reset}
        style={{
          marginTop: "2rem",
          display: "inline-flex",
          height: "2.5rem",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.375rem",
          borderRadius: "0.5rem",
          padding: "0 1.5rem",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#ffffff",
          backgroundColor: "#18181b",
          border: "none",
          cursor: "pointer",
        }}
      >
        <RefreshCw style={{ height: "1rem", width: "1rem" }} />
        {ERROR_MESSAGES.CRITICAL.REFRESH}
      </button>
    </main>
  );
}
