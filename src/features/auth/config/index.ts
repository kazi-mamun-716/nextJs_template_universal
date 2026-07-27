/**
 * Auth feature configuration.
 */
export const authFeatureConfig = {
  /** Max failed login attempts before rate limiting */
  maxLoginAttempts: 5,
  /** Password reset token expiry in minutes */
  resetTokenExpiryMinutes: 60,
  /** Whether email verification is required */
  requireEmailVerification: true,
  /** Whether to allow OAuth-only accounts */
  allowOAuthOnly: false,
};
