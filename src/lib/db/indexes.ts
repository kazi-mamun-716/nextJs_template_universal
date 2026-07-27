/**
 * Index management system.
 *
 * Centralizes index definitions for all Mongoose models.
 * Instead of scattering index definitions across model files,
 * feature modules export their index configurations which are
 * managed through this system.
 *
 * Benefits:
 * - Indexes are visible at a glance
 * - Compound indexes with field order are explicit
 * - TTL, unique, sparse, and partial indexes are easy to configure
 * - Index creation can be synchronized programmatically
 *
 * @example
 * // In your feature model file:
 * export const userIndexes: IndexDefinition[] = [
 *   { fields: { email: 1 }, options: { unique: true } },
 *   { fields: { role: 1, status: 1 } },
 * ];
 */

import type { Model } from "mongoose";
import { DatabaseError, wrapDatabaseError } from "./errors";

// ─── Types ────────────────────────────────────────────

/** A single index field specification. */
export type IndexField = 1 | -1 | "text" | "hashed" | "2d" | "2dsphere";

/** Options for index creation. */
export interface IndexOptions {
  /** Creates a unique index. */
  unique?: boolean;
  /** Creates a sparse index. */
  sparse?: boolean;
  /** Creates a partial index. */
  partialFilterExpression?: Record<string, unknown>;
  /** Time-to-live in seconds (auto-delete documents after this). */
  expireAfterSeconds?: number;
  /** Index name (auto-generated from fields if not provided). */
  name?: string;
  /** Background index creation. */
  background?: boolean;
  /** Collation settings. */
  collation?: {
    locale: string;
    strength?: number;
    caseLevel?: boolean;
    caseFirst?: string;
    numericOrdering?: boolean;
    alternate?: string;
    maxVariable?: string;
    backwards?: boolean;
  };
  /** Whether the index is hidden from the query planner. */
  hidden?: boolean;
}

/** An index definition for a Mongoose schema. */
export interface IndexDefinition {
  /** The fields to index and their sort direction/type. */
  fields: Record<string, IndexField>;
  /** Optional index configuration. */
  options?: IndexOptions;
}

/** A registered index configuration for a specific model. */
export interface ModelIndexes {
  /** The Mongoose model name. */
  modelName: string;
  /** Index definitions. */
  indexes: IndexDefinition[];
}

// ─── Index Registry ──────────────────────────────────

/**
 * Global registry for model indexes.
 * Features register their indexes here during initialization.
 */
const indexRegistry = new Map<string, ModelIndexes>();

/**
 * Register indexes for a model.
 *
 * @param modelName - The Mongoose model name
 * @param indexes - Array of index definitions
 */
export function registerIndexes(modelName: string, indexes: IndexDefinition[]): void {
  if (indexRegistry.has(modelName)) {
    const existing = indexRegistry.get(modelName)!;
    existing.indexes = [...existing.indexes, ...indexes];
  } else {
    indexRegistry.set(modelName, { modelName, indexes: [...indexes] });
  }
}

/**
 * Get registered indexes for a model.
 *
 * @param modelName - The Mongoose model name
 * @returns The model indexes or undefined
 */
export function getRegisteredIndexes(modelName: string): ModelIndexes | undefined {
  return indexRegistry.get(modelName);
}

/**
 * Get all registered indexes.
 *
 * @returns Array of all registered model indexes
 */
export function getAllRegisteredIndexes(): ModelIndexes[] {
  return Array.from(indexRegistry.values());
}

/**
 * Clear the index registry (useful for testing).
 */
export function clearRegistry(): void {
  indexRegistry.clear();
}

// ─── Index Management ───────────────────────────────

/**
 * Ensure indexes for a specific model.
 * Creates indexes if they don't exist; skips if they already match.
 *
 * @param model - The Mongoose model
 * @param indexes - Array of index definitions
 */
export async function ensureIndexes(model: Model<unknown>, indexes: IndexDefinition[]): Promise<void> {
  try {
    for (const index of indexes) {
      await model.collection.createIndex(index.fields, index.options as Record<string, unknown>);
    }
  } catch (error) {
    throw wrapDatabaseError(error, `Failed to ensure indexes for ${model.modelName}`);
  }
}

/**
 * Ensure all registered indexes for a model.
 * Useful during application startup to synchronize indexes.
 *
 * @param model - The Mongoose model
 */
export async function ensureAllRegisteredIndexes(model: Model<unknown>): Promise<void> {
  const registered = indexRegistry.get(model.modelName);

  if (!registered || registered.indexes.length === 0) {
    return;
  }

  await ensureIndexes(model, registered.indexes);
}

/**
 * Drop an index from a model.
 *
 * @param model - The Mongoose model
 * @param indexName - The name of the index to drop
 */
export async function dropIndex(model: Model<unknown>, indexName: string): Promise<void> {
  try {
    await model.collection.dropIndex(indexName);
  } catch (error) {
    throw wrapDatabaseError(error, `Failed to drop index "${indexName}" on ${model.modelName}`);
  }
}

/**
 * List all indexes on a model.
 *
 * @param model - The Mongoose model
 * @returns Array of index information
 */
export async function listIndexes(model: Model<unknown>): Promise<Record<string, unknown>[]> {
  try {
    return await model.collection.indexes();
  } catch (error) {
    throw wrapDatabaseError(error, `Failed to list indexes for ${model.modelName}`);
  }
}

// ─── Common Index Helpers ───────────────────────────

/** Common indexes for timestamp-based queries. */
export const TIMESTAMP_INDEXES: IndexDefinition[] = [
  { fields: { createdAt: -1 } },
  { fields: { updatedAt: -1 } },
  { fields: { createdAt: -1, updatedAt: -1 } },
];

/** Common indexes for soft-delete queries. */
export const SOFT_DELETE_INDEXES: IndexDefinition[] = [
  { fields: { deletedAt: 1 }, options: { sparse: true } },
  { fields: { isDeleted: 1 } },
  { fields: { isDeleted: 1, createdAt: -1 } },
];

/** Common indexes for audit queries. */
export const AUDIT_INDEXES: IndexDefinition[] = [
  { fields: { createdBy: 1 } },
  { fields: { updatedBy: 1 } },
];

/** Common indexes for status-based queries. */
export const STATUS_INDEXES: IndexDefinition[] = [
  { fields: { status: 1 } },
  { fields: { status: 1, createdAt: -1 } },
];
