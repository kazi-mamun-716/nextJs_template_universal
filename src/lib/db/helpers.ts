/**
 * Database utility helpers.
 *
 * Provides reusable query builders, aggregation pipeline factories,
 * and conversion utilities to reduce boilerplate in feature repositories.
 *
 * @example
 * import { buildPaginationStage, toObjectId } from "@/lib/db/helpers";
 *
 * const pipeline = [
 *   { $match: { status: "active" } },
 *   ...buildPaginationStage(1, 20),
 * ];
 */

import mongoose, { Types, type PipelineStage, type FilterQuery, type SortOrder } from "mongoose";
import { QueryError } from "./errors";

// ─── ObjectId Utilities ──────────────────────────────

/**
 * Safely convert a string to a MongoDB ObjectId.
 * Returns null if the string is not a valid ObjectId (no throw).
 *
 * @param id - String to convert
 * @returns ObjectId or null
 */
export function toObjectId(id: string): Types.ObjectId | null {
  if (Types.ObjectId.isValid(id)) {
    return new Types.ObjectId(id);
  }
  return null;
}

/**
 * Safely convert a string to a MongoDB ObjectId.
 * Throws if the string is not a valid ObjectId.
 *
 * @param id - String to convert
 * @returns ObjectId
 * @throws QueryError if the string is not a valid ObjectId
 */
export function toObjectIdOrThrow(id: string): Types.ObjectId {
  const objectId = toObjectId(id);

  if (!objectId) {
    throw new QueryError(`Invalid ObjectId: ${id}`);
  }

  return objectId;
}

/**
 * Convert an array of string IDs to ObjectIds.
 * Filters out invalid IDs silently.
 *
 * @param ids - Array of string IDs
 * @returns Array of valid ObjectIds
 */
export function toObjectIds(ids: string[]): Types.ObjectId[] {
  return ids.reduce<Types.ObjectId[]>((validIds, id) => {
    const objectId = toObjectId(id);
    if (objectId) validIds.push(objectId);
    return validIds;
  }, []);
}

/**
 * Check if a string is a valid MongoDB ObjectId.
 *
 * @param id - String to check
 * @returns Whether the string is a valid ObjectId
 */
export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

// ─── Query Builders ──────────────────────────────────

/**
 * Build a $match stage for filtering deleted documents.
 * Use this for models that support soft-delete.
 *
 * @param includeDeleted - Whether to include deleted documents
 * @returns $match stage
 */
export function excludeDeleted(includeDeleted = false): PipelineStage.Match | Record<string, never> {
  if (includeDeleted) return {};

  return {
    $match: {
      $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
    },
  };
}

/**
 * Build a pagination stage ($skip + $limit) for aggregation pipelines.
 *
 * @param page - Page number (1-based)
 * @param pageSize - Items per page
 * @returns Array of $skip and $limit stages
 */
export function buildPaginationStage(page: number, pageSize: number): PipelineStage[] {
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(100, Math.max(1, pageSize));

  return [
    { $skip: (safePage - 1) * safePageSize } as PipelineStage.Skip,
    { $limit: safePageSize } as PipelineStage.Limit,
  ];
}

/**
 * Build a $sort stage from a sort config.
 *
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort direction (\"asc\" or \"desc\")
 * @returns $sort stage
 */
export function buildSortStage(sortBy = "createdAt", sortOrder: SortOrder = "desc"): PipelineStage.Sort {
  return {
    $sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 } as Record<string, 1 | -1>,
  };
}

/**
 * Build a $lookup stage for populating a reference field.
 *
 * @param options - Lookup configuration
 * @returns $lookup pipeline stage
 */
export function buildLookupStage(options: {
  /** Field in the local collection containing the reference. */
  localField: string;
  /** Field in the foreign collection to match. */
  foreignField: string;
  /** Foreign collection name. */
  from: string;
  /** Output field name (defaults to the localField name without "_id" suffix). */
  as?: string;
  /** Optional pipeline stages to apply to the lookup. */
  pipeline?: PipelineStage[];
}): PipelineStage.Lookup {
  return {
    $lookup: {
      from: options.from,
      localField: options.localField,
      foreignField: options.foreignField,
      as: options.as ?? options.localField.replace(/_id$/, ""),
      pipeline: options.pipeline as any,
    },
  };
}

/**
 * Build a $facet stage for paginated aggregation results.
 *
 * @param page - Page number (1-based)
 * @param pageSize - Items per page
 * @returns $facet pipeline stage
 */
export function buildFacetStage(page: number, pageSize: number): PipelineStage.Facet {
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(100, Math.max(1, pageSize));

  return {
    $facet: {
      data: [{ $skip: (safePage - 1) * safePageSize }, { $limit: safePageSize }],
      meta: [{ $count: "total" }],
    },
  } as PipelineStage.Facet;
}

// ─── Sanitization ────────────────────────────────────

/**
 * Sanitize a filter query by removing undefined and null values.
 * Prevents accidental null matches in MongoDB queries.
 *
 * @param filter - The filter object to sanitize
 * @returns Sanitized filter object
 */
export function sanitizeFilter<T extends Record<string, unknown>>(filter: T): Partial<T> {
  const sanitized: Partial<T> = {};

  for (const [key, value] of Object.entries(filter)) {
    if (value !== undefined && value !== null) {
      (sanitized as Record<string, unknown>)[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize update data by removing undefined values.
 * Prevents accidentally setting fields to undefined.
 *
 * @param data - The update data to sanitize
 * @returns Sanitized update data
 */
export function sanitizeUpdate<T extends Record<string, unknown>>(data: T): Partial<T> {
  const sanitized: Partial<T> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      (sanitized as Record<string, unknown>)[key] = value;
    }
  }

  return sanitized;
}

// ─── Date Range Builders ─────────────────────────────

/**
 * Build a date range filter for a specific field.
 *
 * @param field - The date field name
 * @param startDate - Start of the range (ISO string or Date)
 * @param endDate - End of the range (ISO string or Date)
 * @returns Date range filter or empty object
 */
export function buildDateRangeFilter(
  field: string,
  startDate?: string | Date,
  endDate?: string | Date,
): FilterQuery<Record<string, unknown>> {
  const range: Record<string, unknown> = {};

  if (startDate) {
    range.$gte = new Date(startDate);
  }

  if (endDate) {
    range.$lte = new Date(endDate);
  }

  if (Object.keys(range).length === 0) {
    return {};
  }

  return { [field]: range };
}

// ─── Text Search ────────────────────────────────────

/**
 * Build a text search filter for MongoDB $text indexes.
 *
 * @param searchTerm - The search term
 * @param caseSensitive - Whether the search is case-sensitive
 * @param diacriticSensitive - Whether the search is diacritic-sensitive
 * @returns $text filter or empty object
 */
export function buildTextSearchFilter(
  searchTerm?: string,
  caseSensitive = false,
  diacriticSensitive = false,
): FilterQuery<Record<string, unknown>> {
  if (!searchTerm?.trim()) return {};

  return {
    $text: {
      $search: searchTerm.trim(),
      $caseSensitive: caseSensitive,
      $diacriticSensitive: diacriticSensitive,
    },
  };
}

/**
 * Build a regex search filter for a specific field.
 * Useful when $text index is not available.
 *
 * @param field - The field to search
 * @param searchTerm - The search term
 * @param options - Regex options (default: "i" for case-insensitive)
 * @returns Regex filter or empty object
 */
export function buildRegexFilter(
  field: string,
  searchTerm?: string,
  options = "i",
): FilterQuery<Record<string, unknown>> {
  if (!searchTerm?.trim()) return {};

  return {
    [field]: {
      $regex: searchTerm.trim(),
      $options: options,
    },
  };
}

// ─── Projection Helpers ─────────────────────────────

/**
 * Build a projection that excludes sensitive fields.
 * Always excludes __v, and optionally other internal fields.
 *
 * @param extraExclusions - Additional fields to exclude
 * @returns Projection object
 */
export function excludeInternalFields(...extraExclusions: string[]): Record<string, 0> {
  const exclusions: Record<string, 0> = {
    __v: 0,
  };

  for (const field of extraExclusions) {
    exclusions[field] = 0;
  }

  return exclusions;
}

// ─── Connection Status ─────────────────────────────

/**
 * Get the current MongoDB connection state as a human-readable string.
 *
 * @returns Connection state description
 */
export function getConnectionState(): string {
  const state = mongoose.connection.readyState;
  const states: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return states[state] ?? "unknown";
}

/**
 * Check if the database connection is ready.
 *
 * @returns Whether the connection is established
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
