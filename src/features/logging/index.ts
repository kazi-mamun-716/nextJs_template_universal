/**
 * Logging Feature — Public API
 *
 * Export surface for all logging-related functionality.
 * Import from this barrel instead of deep-importing internal files.
 *
 * @example
 * import { apiLogger, auditLogger, devLogger } from "@/features/logging";
 * import type { AuditLogEntry, LogLevel } from "@/features/logging";
 */

// ─── Services ────────────────────────────────────────
export { apiLogger } from "./services/api-logger";
export { auditLogger } from "./services/audit-logger";
export { devLogger } from "./services/dev-logger";

// ─── Types ───────────────────────────────────────────
export type {
  LogLevel,
  LogCategory,
  ApiLogEntry,
  AuditAction,
  AuditSeverity,
  AuditLogEntry,
  DevTimer,
  DevGroup,
  ApiLoggerOptions,
  AuditLoggerOptions,
} from "./types";

// ─── Constants ───────────────────────────────────────
export {
  DEFAULT_API_LOGGER_OPTIONS,
  DEFAULT_AUDIT_LOGGER_OPTIONS,
  AUDIT_ACTION_LABELS,
  CATEGORY_LABELS,
  STATUS_RANGES,
  MUTATING_METHODS,
} from "./constants";
