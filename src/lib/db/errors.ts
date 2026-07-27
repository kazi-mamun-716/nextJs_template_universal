/**
 * Database error classes.
 *
 * Provides a typed error hierarchy for all database operations.
 * Every database error thrown in the application should be one of these types.
 * This enables proper error handling at the API layer and prevents
 * internal Mongoose errors from leaking to clients.
 *
 * @example
 * import { NotFoundError, DuplicateKeyError } from "@/lib/db/errors";
 *
 * const user = await User.findById(id);
 * if (!user) throw new NotFoundError("User", id);
 */

// ─── Base Database Error ──────────────────────────────

/**
 * Base class for all database-related errors.
 * Catches all database errors in error boundaries.
 */
export class DatabaseError extends Error {
  /** HTTP status code mapping for API responses. */
  public readonly statusCode: number;
  /** Error code for programmatic handling. */
  public readonly code: string;
  /** Whether the error is retryable. */
  public readonly retryable: boolean;

  constructor(message: string, statusCode = 500, code = "DATABASE_ERROR", retryable = false) {
    super(message);
    this.name = "DatabaseError";
    this.statusCode = statusCode;
    this.code = code;
    this.retryable = retryable;
  }
}

// ─── Specific Database Errors ────────────────────────

/**
 * Thrown when the database connection fails or is lost.
 */
export class ConnectionError extends DatabaseError {
  constructor(message = "Database connection failed") {
    super(message, 503, "CONNECTION_ERROR", true);
    this.name = "ConnectionError";
  }
}

/**
 * Thrown when a requested document is not found.
 * Typically maps to a 404 HTTP response.
 */
export class NotFoundError extends DatabaseError {
  /** The model name being queried. */
  public readonly modelName: string;
  /** The identifier that was searched for. */
  public readonly identifier: string;

  constructor(modelName: string, identifier: string) {
    super(`${modelName} not found: ${identifier}`, 404, "NOT_FOUND", false);
    this.name = "NotFoundError";
    this.modelName = modelName;
    this.identifier = identifier;
  }
}

/**
 * Thrown when a unique index constraint is violated.
 * Typically maps to a 409 HTTP response.
 */
export class DuplicateKeyError extends DatabaseError {
  /** The field(s) that caused the duplicate. */
  public readonly fields: Record<string, unknown>;
  /** The value(s) that violated uniqueness. */
  public readonly values: Record<string, unknown>;

  constructor(fields: Record<string, unknown>) {
    const fieldList = Object.entries(fields)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    super(`Duplicate key: ${fieldList}`, 409, "DUPLICATE_KEY", false);
    this.name = "DuplicateKeyError";
    this.fields = fields;
    this.values = fields;
  }
}

/**
 * Thrown when a database validation fails.
 * Maps to a 400 HTTP response.
 */
export class ValidationError extends DatabaseError {
  /** Detailed validation errors keyed by field path. */
  public readonly errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    const summary = Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
      .join("; ");
    super(`Validation failed: ${summary}`, 400, "VALIDATION_ERROR", false);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

/**
 * Thrown when a database operation times out.
 */
export class TimeoutError extends DatabaseError {
  /** The operation that timed out. */
  public readonly operation: string;
  /** Timeout duration in milliseconds. */
  public readonly timeoutMs: number;

  constructor(operation: string, timeoutMs: number) {
    super(`Operation "${operation}" timed out after ${timeoutMs}ms`, 503, "TIMEOUT", true);
    this.name = "TimeoutError";
    this.operation = operation;
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Thrown when an invalid query is constructed.
 */
export class QueryError extends DatabaseError {
  constructor(message: string) {
    super(message, 400, "QUERY_ERROR", false);
    this.name = "QueryError";
  }
}

// ─── Utilities ───────────────────────────────────────

/**
 * Wraps any error into a DatabaseError.
 * Passes through existing DatabaseErrors unchanged.
 * Converts Mongoose errors into typed database errors.
 *
 * @param error - The caught error
 * @param defaultMessage - Fallback message if error is unknown
 * @returns A typed DatabaseError
 */
export function wrapDatabaseError(error: unknown, defaultMessage = "An unexpected database error occurred"): DatabaseError {
  // Pass through existing DatabaseErrors
  if (error instanceof DatabaseError) {
    return error;
  }

  // Handle generic Error instances
  if (error instanceof Error) {
    const message = error.message || defaultMessage;

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const mongooseError = error as unknown as Record<string, unknown>;
      const errors = mongooseError.errors as Record<string, { message: string }> | undefined;
      const formatted: Record<string, string[]> = {};
      if (errors) {
        for (const [field, err] of Object.entries(errors)) {
          formatted[field] = [err.message];
        }
      }
      return new ValidationError(formatted);
    }

    // Mongoose duplicate key error
    if ("code" in error && (error as { code: number }).code === 11000) {
      const keyValue = (error as { keyValue?: Record<string, unknown> }).keyValue ?? {};
      return new DuplicateKeyError(keyValue);
    }

    // Mongoose casting error (invalid ObjectId, etc.)
    if (error.name === "CastError") {
      const castError = error as { path?: string; value?: unknown };
      const path = castError.path ?? "field";
      const value = castError.value ?? "unknown";
      return new QueryError(`Invalid value for ${path}: ${value}`);
    }

    return new DatabaseError(message, 500, "DATABASE_ERROR", false);
  }

  // Unknown error types
  return new DatabaseError(defaultMessage, 500, "UNKNOWN_ERROR", false);
}
