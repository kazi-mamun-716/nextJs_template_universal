/**
 * Feature flags configuration.
 *
 * Feature flags control the availability of in-development or experimental features.
 * They can be toggled via environment variables or programmatically.
 *
 * Naming convention: use kebab-case for flag keys.
 *
 * @example
 * import { featureFlags } from "@/config/features";
 *
 * if (featureFlags.isEnabled("new-onboarding-flow")) {
 *   // Show new onboarding
 * }
 */

// ─── Flag Definitions ───────────────────────────────────────

/**
 * All available feature flags.
 * Add new flags here to make them available throughout the application.
 */
export const FEATURE_FLAGS = {
  /** Enable the new onboarding flow for new users */
  "new-onboarding-flow": false,

  /** Enable AI-powered content suggestions */
  "ai-content-suggestions": false,

  /** Enable the beta version of the analytics dashboard */
  "analytics-dashboard-v2": false,

  /** Enable dark mode toggle in settings */
  "dark-mode": true,

  /** Enable social login (Google, GitHub) */
  "social-login": true,

  /** Enable email verification flow */
  "email-verification": true,

  /** Enable two-factor authentication */
  "two-factor-auth": false,

  /** Enable the billing/subscription module */
  billing: false,

  /** Enable the blog module */
  blog: false,

  /** Enable notifications module */
  notifications: false,

  /** Enable API rate limiting */
  "rate-limiting": true,

  /** Enable audit logging for admin actions */
  "audit-logging": false,
} as const;

// ─── Types ──────────────────────────────────────────────────

/** Union type of all feature flag keys */
export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/** Shape of the features configuration */
export type FeatureFlags = typeof FEATURE_FLAGS;

// ─── Overrides from Environment ─────────────────────────────

/**
 * Feature flags with environment variable overrides.
 *
 * Environment variables use the format: FEATURE_FLAG_<UPPER_CASE_NAME>
 * Example: FEATURE_FLAG_NEW_ONBOARDING_FLOW=true
 *
 * This allows toggling features without code changes.
 */
function loadFeatureFlags(): FeatureFlags {
  const flags = { ...FEATURE_FLAGS } as Record<string, boolean>;

  for (const key of Object.keys(FEATURE_FLAGS)) {
    const envKey = `FEATURE_FLAG_${key.toUpperCase().replace(/-/g, "_")}`;
    const envValue = process.env[envKey];

    if (envValue !== undefined) {
      flags[key] = envValue === "true" || envValue === "1";
    }
  }

  return flags as FeatureFlags;
}

/**
 * Type-safe feature flags object.
 * Flags can be overridden via environment variables.
 *
 * @example
 * // Check a flag
 * if (featureFlags["new-onboarding-flow"]) { ... }
 *
 * // Override via .env.local:
 * // FEATURE_FLAG_NEW_ONBOARDING_FLOW=true
 */
export const featureFlags = loadFeatureFlags();

// ─── Helper ─────────────────────────────────────────────────

/**
 * Check if a specific feature flag is enabled.
 *
 * @example
 * if (isFeatureEnabled("ai-content-suggestions")) {
 *   renderAiSuggestions();
 * }
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag];
}
