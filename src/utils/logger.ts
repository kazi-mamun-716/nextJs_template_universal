type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Structured logger with development and production modes.
 * In development, logs are formatted for readability.
 * In production, logs are structured for ingestion by log management tools.
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && { context }),
      ...(error && { error: { name: error.name, message: error.message, stack: error.stack } }),
    };

    if (this.isDevelopment) {
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
      const styledMessage = `${prefix} ${message}`;

      /* eslint-disable no-console */
      switch (level) {
        case "debug":
          console.debug(styledMessage, context ?? "");
          break;
        case "info":
          console.info(styledMessage, context ?? "");
          break;
        case "warn":
          console.warn(styledMessage, context ?? "", error ?? "");
          break;
        case "error":
          console.error(styledMessage, context ?? "", error ?? "");
          break;
      }
      /* eslint-enable no-console */
    } else {
      // In production, output JSON for log aggregation tools
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(entry));
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log("warn", message, context, error);
  }

  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log("error", message, context, error);
  }
}

export const logger = new Logger();
