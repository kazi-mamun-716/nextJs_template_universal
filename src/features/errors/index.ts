/**
 * Errors Feature — Public API
 */

// ─── Components ──────────────────────────────────────
export { ErrorBoundary, type ErrorBoundaryProps } from "./components/error-boundary";
export { ErrorFallback, type ErrorFallbackProps } from "./components/error-fallback";
export { NotFoundContent, type NotFoundContentProps } from "./components/not-found-content";
export { ErrorContent, type ErrorContentProps } from "./components/error-content";
export { GlobalErrorContent, type GlobalErrorContentProps } from "./components/global-error-content";

// ─── Services ────────────────────────────────────────
export { errorLogger } from "./services/error-logger";

// ─── Types ───────────────────────────────────────────
export type {
  ErrorLevel,
  ErrorMetadata,
  ErrorBoundaryState,
  ErrorDisplayProps,
} from "./types";

// ─── Constants ───────────────────────────────────────
export { ERROR_MESSAGES, ERROR_STATUS, ERROR_CODES, NOT_FOUND_QUICK_LINKS } from "./constants";
