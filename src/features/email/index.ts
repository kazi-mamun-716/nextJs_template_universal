/**
 * Email Feature — Public API
 *
 * Export surface for all email-related functionality.
 * Import from this barrel instead of deep-importing internal files.
 *
 * @example
 * import { emailService, WelcomeEmail, EMAIL_SUBJECTS } from "@/features/email";
 */

// ─── Components ──────────────────────────────────────
export { EmailWrapper, type EmailWrapperProps } from "./components/email-wrapper";
export { WelcomeEmail } from "./components/welcome-email";
export { ResetPasswordEmail } from "./components/reset-password-email";
export { VerifyEmail } from "./components/verify-email";
export { NotificationEmail } from "./components/notification-email";

// ─── Services ────────────────────────────────────────
export { emailService } from "./services/email-service";

// ─── Types ───────────────────────────────────────────
export type {
  IEmailPayload,
  IEmailResponse,
  EmailTemplate,
  WelcomeEmailProps,
  ResetPasswordEmailProps,
  VerifyEmailProps,
  NotificationEmailProps,
} from "./types";

// ─── Schemas ─────────────────────────────────────────
export {
  sendEmailSchema,
  sendWelcomeSchema,
  sendResetPasswordSchema,
  sendVerificationSchema,
  sendNotificationSchema,
} from "./schemas/email-schema";

// ─── Server Actions ──────────────────────────────────
export {
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendNotificationEmail,
} from "./actions/send-email";

// ─── Config ──────────────────────────────────────────
export { emailFeatureConfig } from "./config";

// ─── Constants ───────────────────────────────────────
export {
  EMAIL_MESSAGES,
  EMAIL_SUBJECTS,
  EMAIL_BRANDING,
  EMAIL_EXPIRY_TEXT,
} from "./constants";
