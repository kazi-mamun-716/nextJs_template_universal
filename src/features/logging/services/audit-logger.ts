/**
 * Audit Logger — records important user actions for compliance and debugging.
 *
 * Every entry captures who performed the action, what action was taken,
 * which resource was affected, and additional context. Entries are logged
 * to the application logger and can be extended to persist to the database.
 *
 * @example
 * import { auditLogger } from "@/features/logging/services/audit-logger";
 *
 * await auditLogger.record({
 *   action: "user.login",
 *   actor: { id: userId, email: user.email, name: user.name },
 *   target: { type: "user", id: userId },
 *   source: { ip: request.ip, userAgent: request.headers["user-agent"] },
 * });
 */

import { logger } from "@/utils/logger";
import { errorLogger } from "@/features/errors/services/error-logger";
import type { AuditLogEntry, AuditLoggerOptions, AuditSeverity } from "../types";
import { DEFAULT_AUDIT_LOGGER_OPTIONS, AUDIT_ACTION_LABELS } from "../constants";

class AuditLogger {
  private options: Required<AuditLoggerOptions>;

  constructor(options?: AuditLoggerOptions) {
    this.options = {
      enabled: options?.enabled ?? DEFAULT_AUDIT_LOGGER_OPTIONS.enabled,
      minSeverity: options?.minSeverity ?? DEFAULT_AUDIT_LOGGER_OPTIONS.minSeverity,
    };
  }

  /**
   * Record an auditable event.
   *
   * @param entry - Partial entry data (id and timestamp are auto-generated)
   * @returns The complete audit entry
   *
   * @example
   * await auditLogger.record({
   *   action: "user.password_change",
   *   actor: { id: userId, email: user.email },
   *   severity: "warning",
   *   context: { changedVia: "reset-token" },
   * });
   */
  async record(
    entry: Omit<AuditLogEntry, "id" | "timestamp">,
  ): Promise<AuditLogEntry> {
    if (!this.options.enabled) {
      return {
        ...entry,
        id: "",
        timestamp: new Date().toISOString(),
      } as AuditLogEntry;
    }

    const severityOrder: Record<AuditSeverity, number> = {
      info: 0,
      warning: 1,
      critical: 2,
    };

    // Skip if below minimum severity threshold
    if (severityOrder[entry.severity] < severityOrder[this.options.minSeverity]) {
      return {
        ...entry,
        id: "",
        timestamp: new Date().toISOString(),
      } as AuditLogEntry;
    }

    const fullEntry: AuditLogEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };

    // Log to structured logger
    const label = AUDIT_ACTION_LABELS[fullEntry.action] ?? fullEntry.action;
    const prefix = `[AUDIT] [${fullEntry.severity.toUpperCase()}] ${label}`;

    const level = fullEntry.severity === "critical" ? "error" : fullEntry.severity === "warning" ? "warn" : "info";

    logger[level](prefix, {
      auditId: fullEntry.id,
      action: fullEntry.action,
      actorId: fullEntry.actor.id,
      actorEmail: fullEntry.actor.email,
      targetType: fullEntry.target?.type,
      targetId: fullEntry.target?.id,
      context: fullEntry.context,
      timestamp: fullEntry.timestamp,
    });

    // For critical events, also capture via error logger
    if (fullEntry.severity === "critical") {
      errorLogger.capture(new Error(`Critical audit event: ${label}`), {
        level: "critical",
        source: "AuditLogger",
        context: { auditEntry: fullEntry },
      });
    }

    // TODO: Persist audit entry to database
    // await AuditLogModel.create(fullEntry);

    return fullEntry;
  }

  /**
   * Convenience: record a login event.
   */
  async login(actor: AuditLogEntry["actor"], source?: AuditLogEntry["source"]): Promise<AuditLogEntry> {
    return this.record({
      action: "user.login",
      actor,
      severity: "info",
      source,
    });
  }

  /**
   * Convenience: record a registration event.
   */
  async register(actor: AuditLogEntry["actor"], source?: AuditLogEntry["source"]): Promise<AuditLogEntry> {
    return this.record({
      action: "user.register",
      actor,
      severity: "info",
      source,
    });
  }

  /**
   * Convenience: record a profile update event.
   */
  async profileUpdate(
    actor: AuditLogEntry["actor"],
    changes: Record<string, unknown>,
  ): Promise<AuditLogEntry> {
    return this.record({
      action: "user.profile_update",
      actor,
      target: { type: "user", id: actor.id },
      severity: "info",
      context: { changes },
    });
  }

  /**
   * Convenience: record a security event.
   */
  async securityEvent(
    actor: AuditLogEntry["actor"],
    event: string,
    context?: Record<string, unknown>,
  ): Promise<AuditLogEntry> {
    return this.record({
      action: "security.event",
      actor,
      severity: "warning",
      context: { event, ...context },
    });
  }

  /**
   * Generate a unique audit entry ID.
   */
  private generateId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `AUD-${timestamp}-${random}`;
  }

  /**
   * Configure the logger at runtime.
   */
  configure(options: Partial<AuditLoggerOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

export const auditLogger = new AuditLogger();
