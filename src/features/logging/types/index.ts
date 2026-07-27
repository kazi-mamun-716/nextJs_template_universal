/**
 * Logging feature type definitions.
 *
 * Organised into:
 * - LogLevel / LogCategory: Core log primitives
 * - ApiLogEntry: Request/response metadata
 * - AuditLogEntry: User action audit trail
 * - DevLogEntry: Development-time diagnostics
 */

// ─── Core Primitives ─────────────────────────────────

/** Standard log severity levels. */
export type LogLevel = "debug" | "info" | "warn" | "error";

/** High-level categories for organising logs. */
export type LogCategory =
  | "api"
  | "auth"
  | "database"
  | "email"
  | "upload"
  | "cron"
  | "webhook"
  | "system"
  | "security"
  | "audit"
  | "user";

// ─── API Logs ────────────────────────────────────────

/** Metadata captured for each API request/response. */
export interface ApiLogEntry {
  /** HTTP method. */
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Request pathname. */
  path: string;
  /** HTTP response status code. */
  statusCode: number;
  /** Request duration in milliseconds. */
  durationMs: number;
  /** Authenticated user ID (if available). */
  userId?: string;
  /** Request IP address. */
  ip?: string;
  /** User-agent header. */
  userAgent?: string;
  /** ISO timestamp of the request. */
  timestamp: string;
  /** Optional error message (for failed requests). */
  error?: string;
}

// ─── Audit Logs ──────────────────────────────────────

/** Types of auditable user actions. */
export type AuditAction =
  | "user.login"
  | "user.logout"
  | "user.register"
  | "user.delete"
  | "user.password_change"
  | "user.email_change"
  | "user.profile_update"
  | "user.settings_update"
  | "user.avatar_update"
  | "user.role_change"
  | "admin.action"
  | "content.create"
  | "content.update"
  | "content.delete"
  | "settings.change"
  | "security.event";

/** Severity of an auditable event. */
export type AuditSeverity = "info" | "warning" | "critical";

/** Entry recorded in the audit trail. */
export interface AuditLogEntry {
  /** Unique event identifier. */
  id: string;
  /** The action that occurred. */
  action: AuditAction;
  /** Who performed the action. */
  actor: {
    id: string;
    email?: string;
    name?: string;
  };
  /** What was affected (e.g. resource type and ID). */
  target?: {
    type: string;
    id: string;
  };
  /** Additional context key-value pairs. */
  context?: Record<string, unknown>;
  /** Where the action was performed. */
  source?: {
    ip?: string;
    userAgent?: string;
  };
  /** Event severity. */
  severity: AuditSeverity;
  /** ISO timestamp. */
  timestamp: string;
}

// ─── Dev Logs ────────────────────────────────────────

/** A timed section for performance measurement. */
export interface DevTimer {
  /** Timer label. */
  label: string;
  /** Start timestamp (ms). */
  start: number;
  /** End timestamp (ms), set when timer stops. */
  end?: number;
  /** Duration in ms, calculated on stop. */
  duration?: number;
}

/** A diagnostic group for organising related dev logs. */
export interface DevGroup {
  /** Group label. */
  label: string;
  /** When the group was opened. */
  openedAt: number;
}

// ─── Configuration ──────────────────────────────────

/** Options for configuring the api-logger. */
export interface ApiLoggerOptions {
  /** Whether to log request bodies (default: false). */
  logRequestBody?: boolean;
  /** Whether to log response bodies (default: false). */
  logResponseBody?: boolean;
  /** Status codes that should always be logged. */
  logAlwaysStatuses?: number[];
  /** Whether to enable API logging at all (default: true). */
  enabled?: boolean;
}

/** Options for configuring the audit-logger. */
export interface AuditLoggerOptions {
  /** Whether audit logging is enabled (default: true). */
  enabled?: boolean;
  /** Minimum severity to record (default: "info"). */
  minSeverity?: AuditSeverity;
}
