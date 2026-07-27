/**
 * Email service configuration.
 */
export const emailConfig = {
  fromAddress: process.env.RESEND_FROM_EMAIL ?? "noreply@example.com",
  replyToAddress: process.env.RESEND_FROM_EMAIL ?? "support@example.com",
  rateLimit: {
    perMinute: 10,
    perHour: 100,
  },
} as const;
