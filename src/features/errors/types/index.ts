/**
 * Error handling type definitions.
 */

/** Severity levels for error tracking. */
export type ErrorLevel = "info" | "warning" | "error" | "critical";

/** Additional metadata attached to an error. */
export interface ErrorMetadata {
  /** Error severity level. */
  level: ErrorLevel;
  /** Component or module where the error occurred. */
  source?: string;
  /** User-friendly error code (e.g. "AUTH_EXPIRED"). */
  code?: string;
  /** Whether the error is recoverable. */
  recoverable?: boolean;
  /** Additional context key-value pairs. */
  context?: Record<string, unknown>;
  /** Timestamp of when the error occurred. */
  timestamp: string;
}

/** State for the ErrorBoundary component. */
export interface ErrorBoundaryState {
  /** Whether an error has been caught. */
  hasError: boolean;
  /** The caught error object. */
  error: Error | null;
  /** Generated metadata for the error. */
  metadata: ErrorMetadata | null;
}

/** Props shared across error display components. */
export interface ErrorDisplayProps {
  /** Error title. */
  title?: string;
  /** Error message description. */
  message?: string;
  /** Optional error code / tracking ID. */
  errorId?: string;
  /** Callback to retry the failed operation. */
  onRetry?: () => void;
  /** Custom CSS class. */
  className?: string;
}
