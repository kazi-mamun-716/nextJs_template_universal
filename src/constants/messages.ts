/**
 * User-facing message constants.
 * Centralizes all messages for consistency and future i18n readiness.
 */
export const MESSAGES = {
  // Success
  SUCCESS: "Operation completed successfully.",
  PROFILE_UPDATED: "Profile updated successfully.",
  PASSWORD_UPDATED: "Password updated successfully.",
  EMAIL_SENT: "Email sent successfully.",
  ACCOUNT_CREATED: "Account created successfully. Please check your email to verify.",
  LOGGED_IN: "Logged in successfully.",
  LOGGED_OUT: "Logged out successfully.",

  // Errors
  SOMETHING_WENT_WRONG: "Something went wrong. Please try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  EMAIL_IN_USE: "An account with this email already exists.",
  RATE_LIMITED: "Too many requests. Please try again later.",
  FILE_TOO_LARGE: "File size exceeds the maximum limit.",
  INVALID_FILE_TYPE: "File type is not supported.",

  // Validation
  REQUIRED_FIELD: "This field is required.",
  INVALID_EMAIL: "Please enter a valid email address.",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters.",
  PASSWORD_MISMATCH: "Passwords do not match.",
} as const;
