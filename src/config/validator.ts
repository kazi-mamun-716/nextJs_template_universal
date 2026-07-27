/**
 * Runtime configuration validator.
 *
 * Validates that all configuration modules have valid values at startup.
 * Catches misconfiguration early with clear error messages.
 */

import { env } from "@/config/env";
import { appConfig } from "@/config/app";
import { databaseConfig } from "@/config/database";
import { authConfig } from "@/config/auth";
import { paginationConfig } from "@/config/pagination";
import { logger } from "@/utils/logger";

interface ConfigError {
  module: string;
  field: string;
  message: string;
}

/**
 * Validates all configuration modules and reports errors.
 * Throws if critical configuration is invalid.
 *
 * @param strict - If true, throws on any error (for production).
 *                 If false, logs warnings (for development).
 */
export function validateConfig(strict = false): void {
  const errors: ConfigError[] = [];

  // ─── App Config ──────────────────────────────────────────
  if (!appConfig.name) {
    errors.push({ module: "app", field: "name", message: "App name is empty" });
  }

  // ─── Database Config ─────────────────────────────────────
  if (!databaseConfig.uri) {
    errors.push({ module: "database", field: "uri", message: "Database URI is empty" });
  }
  if (!databaseConfig.uri.startsWith("mongodb")) {
    errors.push({
      module: "database",
      field: "uri",
      message: `Database URI must start with 'mongodb', got: ${databaseConfig.uri.slice(0, 20)}...`,
    });
  }
  if (databaseConfig.options.maxPoolSize < 1) {
    errors.push({
      module: "database",
      field: "maxPoolSize",
      message: "maxPoolSize must be >= 1",
    });
  }

  // ─── Auth Config ─────────────────────────────────────────
  if (!env.AUTH_SECRET) {
    errors.push({
      module: "auth",
      field: "AUTH_SECRET",
      message: "AUTH_SECRET is required",
    });
  }
  if (authConfig.password.minLength < 6) {
    errors.push({
      module: "auth",
      field: "password.minLength",
      message: "Minimum password length should be at least 6 characters",
    });
  }

  // ─── Email Config ────────────────────────────────────────
  if (env.RESEND_API_KEY && !env.RESEND_FROM_EMAIL) {
    errors.push({
      module: "email",
      field: "RESEND_FROM_EMAIL",
      message: "RESEND_FROM_EMAIL is required when RESEND_API_KEY is set",
    });
  }

  // ─── Report ──────────────────────────────────────────────
  if (errors.length > 0) {
    const message = errors
      .map((e) => `  • [${e.module}] ${e.field}: ${e.message}`)
      .join("\n");

    if (strict) {
      logger.error(`Configuration validation failed:\n${message}`);
      throw new Error(
        `Configuration validation failed with ${errors.length} error(s)`,
      );
    } else {
      logger.warn(`Configuration warnings:\n${message}`);
    }
  } else {
    logger.debug("Configuration validation passed");
  }
}
