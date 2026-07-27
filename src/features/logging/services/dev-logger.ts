/**
 * Dev Logger — enhanced debugging utilities for development.
 *
 * Provides timing, grouping, and performance mark helpers that are
 * only active when NODE_ENV === "development". All methods are
 * no-ops in production.
 *
 * @example
 * import { devLogger } from "@/features/logging/services/dev-logger";
 *
 * // Time a function
 * const stop = devLogger.timer("Database query");
 * await queryDatabase();
 * stop(); // Logs: "[DEV] ⏱ Database query: 142ms"
 *
 * // Group related logs
 * devLogger.group("Auth flow");
 * devLogger.info("Checking session...");
 * devLogger.info("Session valid");
 * devLogger.groupEnd();
 *
 * // Performance marks
 * devLogger.mark("render-start");
 * // ... render ...
 * devLogger.mark("render-end");
 * devLogger.measure("render-start", "render-end"); // Logs duration between marks
 */

import { logger } from "@/utils/logger";
import type { DevTimer, DevGroup } from "../types";

class DevLogger {
  private timers: Map<string, DevTimer> = new Map();
  private groups: DevGroup[] = [];
  private marks: Map<string, number> = new Map();
  private readonly isDev: boolean;

  constructor() {
    this.isDev = process.env.NODE_ENV === "development";
  }

  /**
   * Start a timer for measuring operation duration.
   * Returns a stop function that logs the elapsed time.
   *
   * @param label - Timer label
   * @returns Stop function — call to log and end the timer
   *
   * @example
   * const done = devLogger.timer("Data fetch");
   * const data = await fetchData();
   * done(); // "[DEV] ⏱ Data fetch: 234ms"
   */
  timer(label: string): () => void {
    if (!this.isDev) return () => {};

    const timer: DevTimer = { label, start: performance.now() };
    this.timers.set(label, timer);

    return () => {
      timer.end = performance.now();
      timer.duration = Math.round(timer.end - timer.start);
      logger.info(`[DEV] ⏱ ${timer.label}: ${timer.duration}ms`);
      this.timers.delete(label);
    };
  }

  /**
   * Log as a group heading.
   */
  group(label: string): void {
    if (!this.isDev) return;
    this.groups.push({ label, openedAt: Date.now() });
    logger.info(`[DEV] 📦 ┌─ ${label}`);
  }

  /**
   * End the most recently opened group.
   */
  groupEnd(): void {
    if (!this.isDev) return;
    const group = this.groups.pop();
    if (group) {
      logger.info(`[DEV] 📦 └─ ${group.label} (${Date.now() - group.openedAt}ms)`);
    }
  }

  /**
   * Log an informational development message.
   */
  info(message: string, data?: Record<string, unknown>): void {
    if (!this.isDev) return;
    const indent = this.groups.length > 0 ? "  ".repeat(this.groups.length) : "";
    logger.info(`[DEV] ${indent}${message}`, data);
  }

  /**
   * Log a warning in development.
   */
  warn(message: string, data?: Record<string, unknown>): void {
    if (!this.isDev) return;
    const indent = this.groups.length > 0 ? "  ".repeat(this.groups.length) : "";
    logger.warn(`[DEV] ${indent}⚠ ${message}`, data);
  }

  /**
   * Log an error in development with full stack trace.
   */
  error(message: string, error?: Error): void {
    if (!this.isDev) return;
    logger.error(`[DEV] ✖ ${message}`, undefined, error);
  }

  /**
   * Set a named performance mark.
   */
  mark(name: string): void {
    if (!this.isDev) return;
    this.marks.set(name, performance.now());
  }

  /**
   * Measure and log the duration between two marks.
   *
   * @param from - Start mark name
   * @param to - End mark name
   * @param label - Optional display label (defaults to "from → to")
   */
  measure(from: string, to: string, label?: string): void {
    if (!this.isDev) return;

    const startTime = this.marks.get(from);
    const endTime = this.marks.get(to);

    if (startTime === undefined) {
      logger.warn(`[DEV] ⏱ Mark "${from}" not found`);
      return;
    }
    if (endTime === undefined) {
      logger.warn(`[DEV] ⏱ Mark "${to}" not found`);
      return;
    }

    const duration = Math.round(endTime - startTime);
    const displayLabel = label ?? `${from} → ${to}`;
    logger.info(`[DEV] ⏱ ${displayLabel}: ${duration}ms`);
  }

  /**
   * Time an async function and log the result.
   *
   * @param label - Timer label
   * @param fn - Async function to time
   * @returns The result of the function
   *
   * @example
   * const data = await devLogger.timeAsync("Fetch users", () => fetchUsers());
   */
  async timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    if (!this.isDev) return fn();

    const done = this.timer(label);
    try {
      return await fn();
    } finally {
      done();
    }
  }

  /**
   * Log a value with its type for debugging.
   */
  inspect(label: string, value: unknown): void {
    if (!this.isDev) return;
    logger.info(`[DEV] 🔍 ${label}:`, {
      type: typeof value,
      isArray: Array.isArray(value),
      isNull: value === null,
      value: value as Record<string, unknown>,
    });
  }
}

export const devLogger = new DevLogger();
