/**
 * Email service configuration.
 *
 * All email-sending settings are centralized here.
 * Resend API credentials come from validated env vars.
 */
import { env } from "@/config/env";

export const emailConfig = {
  /** Sender email address */
  fromAddress: env.RESEND_FROM_EMAIL,

  /** Reply-to email address */
  replyToAddress: env.RESEND_FROM_EMAIL,

  /** Resend API key (empty if not configured) */
  apiKey: env.RESEND_API_KEY ?? "",

  /** Whether email sending is available */
  get isEnabled(): boolean {
    return !!this.apiKey;
  },

  /** Rate limits to prevent abuse */
  rateLimit: {
    /** Maximum emails per minute */
    perMinute: 10,
    /** Maximum emails per hour */
    perHour: 100,
  },
} as const;

export type EmailConfig = typeof emailConfig;
