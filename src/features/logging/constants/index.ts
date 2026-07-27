/**
 * Logging feature constants.
 *
 * Centralises log categories, audit action labels, source names,
 * and default configuration values.
 */

// ─── Default Options ─────────────────────────────────

export const DEFAULT_API_LOGGER_OPTIONS = {
  /** Log to console by default */
  enabled: true,
  /** Don't log request bodies by default */
  logRequestBody: false,
  /** Don't log response bodies by default */
  logResponseBody: false,
  /** Always log server errors */
  logAlwaysStatuses: [500, 502, 503, 504],
} as const;

export const DEFAULT_AUDIT_LOGGER_OPTIONS = {
  enabled: true,
  minSeverity: "info" as const,
} as const;

// ─── Human Labels ────────────────────────────────────

/** Maps audit actions to human-readable labels. */
export const AUDIT_ACTION_LABELS: Record<string, string> = {
  "user.login": "User logged in",
  "user.logout": "User logged out",
  "user.register": "User registered",
  "user.delete": "User account deleted",
  "user.password_change": "Password changed",
  "user.email_change": "Email address changed",
  "user.profile_update": "Profile updated",
  "user.settings_update": "Settings updated",
  "user.avatar_update": "Avatar updated",
  "user.role_change": "User role changed",
  "admin.action": "Admin action performed",
  "content.create": "Content created",
  "content.update": "Content updated",
  "content.delete": "Content deleted",
  "settings.change": "Application settings changed",
  "security.event": "Security event detected",
};

/** Maps log categories to display labels. */
export const CATEGORY_LABELS: Record<string, string> = {
  api: "API",
  auth: "Authentication",
  database: "Database",
  email: "Email",
  upload: "Upload",
  cron: "Scheduled Task",
  webhook: "Webhook",
  system: "System",
  security: "Security",
  audit: "Audit",
  user: "User",
};

// ─── Status Code Ranges ─────────────────────────────

/** HTTP status code ranges for quick classification. */
export const STATUS_RANGES = {
  INFORMATIONAL: { min: 100, max: 199 },
  SUCCESS: { min: 200, max: 299 },
  REDIRECTION: { min: 300, max: 399 },
  CLIENT_ERROR: { min: 400, max: 499 },
  SERVER_ERROR: { min: 500, max: 599 },
} as const;

/** Methods that modify state and are worth extra attention. */
export const MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"] as const;
