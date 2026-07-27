/**
 * Email feature type definitions.
 *
 * Organised into:
 * - IEmailPayload / IEmailResponse: Raw send-level types
 * - EmailTemplate: Union of supported template names
 * - *Props: Per-template React component props
 */

// ─── Send Layer ───────────────────────────────────────

/** Raw payload for the email service. */
export interface IEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/** Response from the email sending provider. */
export interface IEmailResponse {
  id: string;
  from: string;
  to: string[];
  createdAt: string;
}

/** Union of supported template names. */
export type EmailTemplate =
  | "welcome"
  | "reset-password"
  | "verify-email"
  | "notification";

// ─── Template Props ───────────────────────────────────

/** Base props shared by all email templates. */
interface BaseEmailProps {
  /** Recipient's full name. */
  userName: string;
  /** Recipient's email address. */
  userEmail: string;
}

/** Props for the welcome email. */
export interface WelcomeEmailProps extends BaseEmailProps {
  /** URL the user can use to log in for the first time. */
  loginUrl: string;
}

/** Props for the password reset email. */
export interface ResetPasswordEmailProps extends BaseEmailProps {
  /** One-time reset link. */
  resetUrl: string;
  /** Minutes until the reset link expires. */
  expiresInMinutes?: number;
}

/** Props for the email verification email. */
export interface VerifyEmailProps extends BaseEmailProps {
  /** One-time verification link. */
  verifyUrl: string;
  /** Minutes until the verification link expires. */
  expiresInMinutes?: number;
}

/** Props for a generic notification email. */
export interface NotificationEmailProps extends BaseEmailProps {
  /** Notification title / headline. */
  title: string;
  /** Main body content (supports basic HTML). */
  message: string;
  /** Optional CTA label and URL. */
  cta?: {
    label: string;
    url: string;
  };
}
