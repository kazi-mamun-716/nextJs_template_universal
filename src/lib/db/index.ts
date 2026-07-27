/**
 * Database architecture barrel export.
 *
 * This module exports the entire MongoDB infrastructure:
 * - Connection management (from lib/db.ts via re-export)
 * - Error classes
 * - Base repository
 * - Transaction helpers
 * - Index management
 * - Query/aggregation helpers
 *
 * Feature code should only import from this barrel or the specific module,
 * never directly from internal dependencies.
 *
 * @example
 * import { BaseRepository, withTransaction, DatabaseError } from "@/lib/db";
 * import { toObjectId, buildPaginationStage } from "@/lib/db/helpers";
 */

// Re-export connection
export {
  connectToDatabase,
  disconnectFromDatabase,
  getDatabaseStatus,
  isDatabaseConnected,
} from "./connection";

// Errors
export {
  DatabaseError,
  ConnectionError,
  NotFoundError,
  DuplicateKeyError,
  ValidationError,
  TimeoutError,
  QueryError,
  wrapDatabaseError,
} from "./errors";

// Base Repository
export { BaseRepository } from "./base-repository";
export type {
  PaginationQuery,
  FindOptions,
  CreateOptions,
  UpdateOptions,
  DeleteOptions,
  BulkWriteResult,
  AggregatedPaginatedResult,
} from "./base-repository";

// Transactions
export { withTransaction, withSimpleTransaction, isTransactionSupported } from "./transactions";
export type { TransactionOptions } from "./transactions";

// Indexes
export {
  registerIndexes,
  getRegisteredIndexes,
  getAllRegisteredIndexes,
  clearRegistry,
  ensureIndexes,
  ensureAllRegisteredIndexes,
  dropIndex,
  listIndexes,
  TIMESTAMP_INDEXES,
  SOFT_DELETE_INDEXES,
  AUDIT_INDEXES,
  STATUS_INDEXES,
} from "./indexes";
export type { IndexField, IndexOptions, IndexDefinition, ModelIndexes } from "./indexes";
