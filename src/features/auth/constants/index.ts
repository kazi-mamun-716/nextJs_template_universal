/**
 * Auth feature constants.
 */
export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Welcome back!",
  LOGIN_FAILED: "Invalid email or password.",
  REGISTER_SUCCESS: "Account created successfully. Please check your email to verify.",
  REGISTER_FAILED: "Could not create account. Please try again.",
  LOGOUT_SUCCESS: "You have been logged out.",
  PASSWORD_RESET_SENT: "If an account exists, a reset email has been sent.",
  PASSWORD_RESET_SUCCESS: "Password reset successfully.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password.",
  EMAIL_IN_USE: "An account with this email already exists.",
  USER_NOT_FOUND: "No account found with this email.",
  INVALID_TOKEN: "Invalid or expired reset token.",
  ACCOUNT_LOCKED: "Account temporarily locked. Please try again later.",
} as const;
