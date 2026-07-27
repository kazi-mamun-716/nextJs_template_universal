/**
 * Email feature constants.
 *
 * Centralises subject lines, branding, and reusable message strings
 * so templates and the service stay consistent.
 */

// ─── Branding ─────────────────────────────────────────

export const EMAIL_BRANDING = {
  /** Display name shown in the email header. */
  APP_NAME: "Universal Next.js Boilerplate",
  /** Sender name shown in the from field. */
  FROM_NAME: "Universal Team",
  /** Tagline shown in the email footer. */
  TAGLINE: "Build better, ship faster.",
  /** Base URL for logo / asset references (no trailing slash). */
  ASSET_BASE_URL: "https://res.cloudinary.com",
} as const;

// ─── Subject Lines ────────────────────────────────────

export const EMAIL_SUBJECTS = {
  WELCOME: "Welcome to Universal Next.js Boilerplate!",
  RESET_PASSWORD: "Reset your password",
  VERIFY_EMAIL: "Verify your email address",
  NOTIFICATION: "New notification from Universal Next.js Boilerplate",
} as const;

// ─── Expiry Disclaimers ───────────────────────────────

export const EMAIL_EXPIRY_TEXT = {
  RESET_LINK: "This password reset link will expire in",
  VERIFY_LINK: "This verification link will expire in",
} as const;

// ─── Messages ─────────────────────────────────────────

export const EMAIL_MESSAGES = {
  SENT_SUCCESS: "Email sent successfully.",
  SENT_FAILED: "Failed to send email.",
  INVALID_ADDRESS: "Invalid email address.",
  RATE_LIMITED: "Too many emails sent. Please try again later.",
  SERVICE_DISABLED:
    "Email service is not configured. Set RESEND_API_KEY in your environment.",
} as const;
