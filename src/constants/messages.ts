/**
 * User-facing message constants.
 * Centralizes all messages for consistency, easy updates, and future i18n readiness.
 *
 * Organisation by category:
 * - SUCCESS: Operation success messages
 * - ERROR: Error messages
 * - VALIDATION: Form validation messages
 * - INFO: Informational messages
 * - CONFIRM: Confirmation dialog messages
 * - LOADING: Loading state messages
 * - API: API response messages
 */

export const MESSAGES = {
  // ─── Success ─────────────────────────────────────────────────
  SUCCESS: {
    DEFAULT: "Operation completed successfully.",
    SAVED: "Changes saved successfully.",
    UPDATED: "Updated successfully.",
    DELETED: "Deleted successfully.",
    CREATED: "Created successfully.",
    PROFILE_UPDATED: "Profile updated successfully.",
    PASSWORD_UPDATED: "Password updated successfully.",
    PASSWORD_RESET: "Password reset successfully.",
    EMAIL_SENT: "Email sent successfully.",
    ACCOUNT_CREATED: "Account created successfully. Please check your email to verify.",
    LOGGED_IN: "Logged in successfully.",
    LOGGED_OUT: "Logged out successfully.",
    UPLOADED: "File uploaded successfully.",
    SUBSCRIBED: "Successfully subscribed.",
  },

  // ─── Error ───────────────────────────────────────────────────
  ERROR: {
    DEFAULT: "Something went wrong. Please try again.",
    NOT_FOUND: "The requested resource was not found.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    FORBIDDEN: "You do not have permission to access this resource.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    EMAIL_IN_USE: "An account with this email already exists.",
    USER_NOT_FOUND: "No account found with this email.",
    RATE_LIMITED: "Too many requests. Please try again later.",
    FILE_TOO_LARGE: "File size exceeds the maximum limit.",
    INVALID_FILE_TYPE: "File type is not supported.",
    UPLOAD_FAILED: "Failed to upload file. Please try again.",
    NETWORK_ERROR: "Network error. Please check your connection.",
    SERVER_ERROR: "Server error. Please try again later.",
    MAINTENANCE: "We are currently undergoing maintenance. Please check back later.",
    EXPIRED_LINK: "This link has expired. Please request a new one.",
    INVALID_TOKEN: "Invalid or expired token.",
    ACCOUNT_LOCKED: "Account temporarily locked due to too many attempts. Please try again later.",
    VALIDATION_ERROR: "Validation failed. Please check your input.",
  },

  // ─── Validation ──────────────────────────────────────────────
  VALIDATION: {
    REQUIRED: "This field is required.",
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_URL: "Please enter a valid URL.",
    INVALID_PHONE: "Please enter a valid phone number.",
    PASSWORD_MIN_LENGTH: "Password must be at least 8 characters.",
    PASSWORD_MAX_LENGTH: "Password must not exceed 128 characters.",
    PASSWORD_MISMATCH: "Passwords do not match.",
    PASSWORD_WEAK: "Password is too weak. Include uppercase, lowercase, and a number.",
    INVALID_NUMBER: "Please enter a valid number.",
    MIN_VALUE: "Value must be at least {min}.",
    MAX_VALUE: "Value must not exceed {max}.",
    MIN_LENGTH: "Must be at least {min} characters.",
    MAX_LENGTH: "Must not exceed {max} characters.",
    INVALID_SLUG: "Only lowercase letters, numbers, and hyphens are allowed.",
    INVALID_DATE: "Please enter a valid date.",
    FUTURE_DATE: "Date must be in the future.",
    PAST_DATE: "Date must be in the past.",
  },

  // ─── Info ────────────────────────────────────────────────────
  INFO: {
    NO_RESULTS: "No results found.",
    NO_DATA: "No data available.",
    LOADING: "Loading...",
    SEARCH: "Search...",
    TYPE_TO_SEARCH: "Type to search...",
    SELECT_OPTION: "Select an option...",
    DRAG_DROP: "Drag and drop files here, or click to browse.",
    COMING_SOON: "Coming soon.",
    PAGE_NOT_FOUND: "The page you are looking for does not exist.",
    EMPTY_STATE: "Nothing here yet.",
    CHANGES_SAVED: "Your changes have been saved.",
    CHANGES_NOT_SAVED: "You have unsaved changes.",
  },

  // ─── Confirm ─────────────────────────────────────────────────
  CONFIRM: {
    DELETE: "Are you sure you want to delete this? This action cannot be undone.",
    DISCARD: "Are you sure you want to discard your changes?",
    LOGOUT: "Are you sure you want to log out?",
    LEAVE: "Are you sure you want to leave? You have unsaved changes.",
    ARCHIVE: "Are you sure you want to archive this?",
    RESTORE: "Are you sure you want to restore this?",
  },

  // ─── Loading ─────────────────────────────────────────────────
  LOADING: {
    DEFAULT: "Loading...",
    SAVING: "Saving...",
    UPLOADING: "Uploading...",
    PROCESSING: "Processing...",
    DELETING: "Deleting...",
    SENDING: "Sending...",
    VERIFYING: "Verifying...",
    REDIRECTING: "Redirecting...",
  },

  // ─── API ─────────────────────────────────────────────────────
  API: {
    SUCCESS: "Request completed successfully.",
    CREATED: "Resource created successfully.",
    UPDATED: "Resource updated successfully.",
    DELETED: "Resource deleted successfully.",
    BAD_REQUEST: "Invalid request. Please check your input.",
    UNAUTHORIZED: "Authentication required.",
    FORBIDDEN: "You do not have permission.",
    NOT_FOUND: "Resource not found.",
    CONFLICT: "Resource already exists.",
    RATE_LIMITED: "Too many requests. Try again later.",
    SERVER_ERROR: "Internal server error.",
    SERVICE_UNAVAILABLE: "Service temporarily unavailable.",
    VALIDATION_ERROR: "Validation failed. Please check your input.",
  },
} as const;

export type MessageCategory = keyof typeof MESSAGES;
