/**
 * Error handling constants.
 */

/** Default error display messages. */
export const ERROR_MESSAGES = {
  NOT_FOUND: {
    TITLE: "Page Not Found",
    DESCRIPTION: "The page you are looking for does not exist or has been moved.",
    SEARCH_PLACEHOLDER: "Search pages...",
    GO_HOME: "Go Home",
    BACK: "Go Back",
    NO_SEARCH_RESULTS: "No pages found for your search.",
  },
  SERVER_ERROR: {
    TITLE: "Something Went Wrong",
    DESCRIPTION: "An unexpected error occurred. Please try again.",
    TRY_AGAIN: "Try Again",
    GO_HOME: "Go Home",
    ERROR_ID_LABEL: "Error ID",
  },
  CRITICAL: {
    TITLE: "Critical Error",
    DESCRIPTION: "A critical error occurred. Please refresh the page or try again later.",
    REFRESH: "Refresh Page",
  },
  FALLBACK: {
    TITLE: "Something went wrong",
    DESCRIPTION: "An error occurred in this section.",
    RETRY: "Try again",
    DISMISS: "Dismiss",
  },
} as const;

/** HTTP status codes for error pages. */
export const ERROR_STATUS = {
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/** Common error codes for tracking. */
export const ERROR_CODES = {
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  VALIDATION: "VALIDATION_ERROR",
  RATE_LIMIT: "RATE_LIMITED",
  NETWORK: "NETWORK_ERROR",
  UNKNOWN: "UNKNOWN_ERROR",
} as const;

/** Suggested quick links for the 404 page. */
export const NOT_FOUND_QUICK_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Home", href: "/" },
] as const;
