/**
 * Authentication configuration.
 */
export const authConfig = {
  /** Session duration in seconds (30 days) */
  sessionMaxAge: 30 * 24 * 60 * 60,

  /** Password requirements */
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: false,
  },

  /** OAuth provider configuration */
  providers: {
    google: {
      enabled: !!process.env.AUTH_GOOGLE_ID,
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    },
    github: {
      enabled: !!process.env.AUTH_GITHUB_ID,
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    },
  },
} as const;
