/**
 * Email feature configuration.
 */
export const emailFeatureConfig = {
  fromAddress: process.env.RESEND_FROM_EMAIL ?? "noreply@example.com",
  rateLimitPerMinute: 10,
  maxRecipientsPerSend: 50,
  templates: {
    welcome: {
      subject: "Welcome!",
    },
    resetPassword: {
      subject: "Reset Your Password",
    },
  },
} as const;
