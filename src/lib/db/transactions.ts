/**
 * Transaction helpers.
 *
 * Provides reusable transaction wrappers for atomic database operations.
 * Use these helpers whenever multiple documents need to be updated together
 * (e.g., creating a user + initial profile, or transferring funds).
 *
 * @example
 * import { withTransaction } from "@/lib/db/transactions";
 *
 * const result = await withTransaction(async (session) => {
 *   const user = await userRepo.create(data, { session });
 *   const profile = await profileRepo.upsert(user.id, { ... }, { session });
 *   return { user, profile };
 * });
 */

import mongoose from "mongoose";
import type { ClientSession } from "mongodb";
import { DatabaseError, ConnectionError } from "./errors";

// ─── Configuration ────────────────────────────────────

/** Default transaction options. */
const DEFAULT_TRANSACTION_OPTIONS: Record<string, unknown> = {
  readConcern: { level: "snapshot" },
  writeConcern: { w: "majority" },
};

/** Maximum retry attempts for transient transaction errors. */
const MAX_RETRIES = 3;

/** Base delay for exponential backoff (milliseconds). */
const BASE_RETRY_DELAY_MS = 100;

// ─── Types ────────────────────────────────────────────

/** Options for withTransaction. */
export interface TransactionOptions {
  /** Mongoose transaction options. */
  transactionOptions?: Record<string, unknown>;
  /** Maximum retry attempts for transient errors (default: 3). */
  maxRetries?: number;
  /** Whether to enable retry on transient errors (default: true). */
  retryable?: boolean;
}

// ─── Helpers ──────────────────────────────────────────

/**
 * Calculate delay for exponential backoff.
 *
 * @param attempt - Current retry attempt number (0-based)
 * @returns Delay in milliseconds
 */
function getRetryDelay(attempt: number): number {
  return Math.min(BASE_RETRY_DELAY_MS * 2 ** attempt, 2000);
}

/**
 * Check if an error is transient and the operation can be retried.
 * Transient errors include network issues, replication delays, and timeouts.
 *
 * @param error - The error to check
 * @returns Whether the error is retryable
 */
function isTransientError(error: unknown): boolean {
  if (error instanceof DatabaseError) {
    return error.retryable;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    const transientKeywords = [
      "transient",
      "timeout",
      "network",
      "connection",
      "replica",
      "primary",
      "not master",
      "write concern",
      "interrupted",
      "shutdown",
      "lock",
      "deadlock",
    ];

    return transientKeywords.some((keyword) => message.includes(keyword));
  }

  return false;
}

// ─── Main Transaction Wrappers ────────────────────────

/**
 * Execute a callback within a MongoDB transaction.
 *
 * If the operation fails with a transient error, it will automatically retry
 * up to `maxRetries` times using exponential backoff.
 *
 * @param callback - Async function to execute within the transaction.
 *                   Receives the session as its argument.
 * @param options - Transaction options
 * @returns The return value of the callback
 *
 * @example
 * // Basic usage
 * const user = await withTransaction(async (session) => {
 *   return userRepo.create(data, { session });
 * });
 *
 * @example
 * // Multi-document transaction with retry disabled
 * const result = await withTransaction(async (session) => {
 *   const user = await userRepo.create(userData, { session });
 *   const profile = await profileRepo.upsert(user.id, profileData, { session });
 *   return { user, profile };
 * }, { retryable: false });
 */
export async function withTransaction<T>(
  callback: (session: ClientSession) => Promise<T>,
  options: TransactionOptions = {},
): Promise<T> {
  const maxRetries = options.maxRetries ?? MAX_RETRIES;
  const retryable = options.retryable ?? true;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= (retryable ? maxRetries : 0); attempt++) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction({
        ...DEFAULT_TRANSACTION_OPTIONS,
        ...options.transactionOptions,
      });

      const result = await callback(session);

      await session.commitTransaction();

      return result;
    } catch (error) {
      // Rollback the transaction
      try {
        await session.abortTransaction();
      } catch {
        // Session may already be ended; ignore abort errors
      }

      const wrapped = error instanceof DatabaseError ? error : new DatabaseError(
        error instanceof Error ? error.message : "Transaction failed",
        500,
        "TRANSACTION_ERROR",
        isTransientError(error),
      );

      lastError = wrapped;

      // If it's a transient error and we can retry, wait and try again
      if (retryable && isTransientError(error) && attempt < maxRetries) {
        const delay = getRetryDelay(attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Non-retryable or exhausted retries
      throw wrapped;
    } finally {
      try {
        await session.endSession();
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  throw lastError ?? new DatabaseError("Transaction failed after all retries", 500, "TRANSACTION_FAILED");
}

/**
 * Execute a callback within a MongoDB transaction without retry logic.
 *
 * Simpler version of `withTransaction` for cases where retry is not needed
 * (e.g., the operation is idempotent or you want to handle retries manually).
 *
 * @param callback - Async function to execute within the transaction
 * @returns The return value of the callback
 */
export async function withSimpleTransaction<T>(
  callback: (session: ClientSession) => Promise<T>,
): Promise<T> {
  return withTransaction(callback, { retryable: false });
}

/**
 * Check if MongoDB transactions are supported by the current deployment.
 * Transactions require a replica set or sharded cluster.
 *
 * @returns Whether transactions are available
 */
export async function isTransactionSupported(): Promise<boolean> {
  try {
    const admin = mongoose.connection.db?.admin();
    if (!admin) return false;

    const result = await admin.serverStatus();
    const repl = (result as { repl?: { setname?: string } }).repl;

    return !!repl?.setname;
  } catch {
    return false;
  }
}
