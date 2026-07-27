/**
 * Email feature configuration.
 *
 * Centralises email-specific settings.
 * The actual API key and from address come from the global config/email.ts
 * which reads from validated environment variables.
 */

import { emailConfig } from "@/config/email";
import { EMAIL_SUBJECTS } from "../constants";

export const emailFeatureConfig = {
  /** From address from validated env vars. */
  fromAddress: emailConfig.fromAddress,

  /** Sender display name. */
  fromName: "Universal Team",

  /** Reply-to address (defaults to from address). */
  replyToAddress: emailConfig.replyToAddress,

  /** Whether the email service has been configured with an API key. */
  isEnabled: emailConfig.isEnabled,

  /** Rate limits to prevent abuse. */
  rateLimit: {
    perMinute: emailConfig.rateLimit.perMinute,
    perHour: emailConfig.rateLimit.perHour,
  },

  /** Maximum recipients per single send call. */
  maxRecipientsPerSend: 50,

  /** Default subject lines per template type. */
  subjects: {
    welcome: EMAIL_SUBJECTS.WELCOME,
    resetPassword: EMAIL_SUBJECTS.RESET_PASSWORD,
    verifyEmail: EMAIL_SUBJECTS.VERIFY_EMAIL,
    notification: EMAIL_SUBJECTS.NOTIFICATION,
  },
} as const;

export type EmailFeatureConfig = typeof emailFeatureConfig;
