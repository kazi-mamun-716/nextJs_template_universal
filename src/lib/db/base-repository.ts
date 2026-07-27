/**
 * Generic base repository.
 *
 * Provides a reusable CRUD foundation for all Mongoose models.
 * Every feature repository should extend this class to inherit
 * standard database operations without duplicating query logic.
 *
 * Features repositories can override or add methods as needed.
 *
 * @example
 * import { BaseRepository } from "@/lib/db/base-repository";
 * import { UserModel } from "@/features/auth/models/user.model";
 * import type { IUser } from "@/types";
 *
 * export class UserRepository extends BaseRepository<IUser> {
 *   async findByEmail(email: string) {
 *     return this.findOne({ email });
 *   }
 * }
 */

import { Types, type Model, type Document, type FilterQuery, type UpdateQuery, type ProjectionType, type PipelineStage, type ClientSession, type AnyBulkWriteOperation } from "mongoose";
import type { PaginatedResponse, SortDirection, SortConfig, PaginationMeta } from "@/types";
import { NotFoundError, wrapDatabaseError, QueryError } from "./errors";

// ─── Types ────────────────────────────────────────────

/** Base document type used by repositories. */
export type BaseDocument = Document;

/** Pagination query parameters for findPaginated. */
export interface PaginationQuery {
  /** Page number (1-based). */
  page?: number;
  /** Number of items per page. */
  pageSize?: number;
  /** Field to sort by. */
  sortBy?: string;
  /** Sort direction. */
  sortOrder?: SortDirection;
  /** Multi-field sort configuration. */
  sort?: SortConfig[];
}

/** Options for find operations. */
export interface FindOptions {
  /** Fields to select/include. */
  select?: ProjectionType<unknown>;
  /** Population paths. */
  populate?: string | string[];
  /** Session for transactions. */
  session?: ClientSession;
}

/** Options for create operations. */
export interface CreateOptions {
  /** Session for transactions. */
  session?: ClientSession;
}

/** Options for update operations. */
export interface UpdateOptions {
  /** Session for transactions. */
  session?: ClientSession;
  /** Return the updated document. */
  new?: boolean;
}

/** Options for delete operations. */
export interface DeleteOptions {
  /** Session for transactions. */
  session?: ClientSession;
}

/** Bulk write operation result. */
export interface BulkWriteResult {
  /** Number of documents inserted. */
  insertedCount: number;
  /** Number of documents matched. */
  matchedCount: number;
  /** Number of documents modified. */
  modifiedCount: number;
  /** Number of documents deleted. */
  deletedCount: number;
  /** Whether the operation was acknowledged. */
  acknowledged: boolean;
}

/** Aggregation pagination result (uses separate meta shape, not PaginationMeta). */
export interface AggregatedPaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** Aggregation pagination result. */
export interface AggregatedPaginatedResult<T> {
  data: T[];
  meta: AggregatedPaginationMeta;
}

// ─── Base Repository ──────────────────────────────────

/**
 * Abstract base repository providing standard CRUD and query operations.
 *
 * @typeParam T - The document interface the repository manages
 */
export abstract class BaseRepository<T extends BaseDocument> {
  /** The Mongoose model instance. */
  protected readonly model: Model<T>;
  /** Human-readable model name for error messages. */
  protected readonly modelName: string;

  constructor(model: Model<T>) {
    this.model = model;
    this.modelName = model.modelName;
  }

  // ─── Read Operations ──────────────────────────────

  /**
   * Find a document by its ID.
   *
   * @param id - MongoDB ObjectId as string
   * @param options - Query options (select, populate, session)
   * @returns The document or null
   */
  async findById(id: string, options: FindOptions = {}): Promise<T | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new QueryError(`Invalid ID format: ${id}`);
      }

      const doc = await this.model.findById(id, options.select, {
        session: options.session,
      });

      return doc as T | null;
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to find ${this.modelName} by ID: ${id}`);
    }
  }

  /**
   * Find a document by ID or throw if not found.
   *
   * @param id - MongoDB ObjectId as string
   * @param options - Query options
   * @returns The document (never null)
   * @throws NotFoundError if document doesn't exist
   */
  async findByIdOrThrow(id: string, options: FindOptions = {}): Promise<T> {
    const document = await this.findById(id, options);

    if (!document) {
      throw new NotFoundError(this.modelName, id);
    }

    return document;
  }

  /**
   * Find a single document matching the filter.
   *
   * @param filter - MongoDB filter query
   * @param options - Query options
   * @returns The first matching document or null
   */
  async findOne(filter: FilterQuery<T>, options: FindOptions = {}): Promise<T | null> {
    try {
      const doc = await this.model.findOne(filter, options.select, {
        session: options.session,
      });

      return doc as T | null;
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to find ${this.modelName}`);
    }
  }

  /**
   * Find a single document or throw if not found.
   *
   * @param filter - MongoDB filter query
   * @param options - Query options
   * @returns The first matching document
   * @throws NotFoundError if no document matches
   */
  async findOneOrThrow(filter: FilterQuery<T>, options: FindOptions = {}): Promise<T> {
    const document = await this.findOne(filter, options);

    if (!document) {
      throw new NotFoundError(this.modelName, JSON.stringify(filter));
    }

    return document;
  }

  /**
   * Find multiple documents matching the filter.
   *
   * @param filter - MongoDB filter query
   * @param options - Query options (select, populate, session, sort, limit, skip)
   * @returns Array of matching documents
   */
  async findMany(
    filter: FilterQuery<T> = {},
    options: FindOptions & { sort?: Record<string, 1 | -1>; limit?: number; skip?: number } = {},
  ): Promise<T[]> {
    try {
      const docs = await this.model.find(filter, options.select, {
        session: options.session,
        sort: options.sort,
        limit: options.limit,
        skip: options.skip,
      });

      return docs as T[];
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to find ${this.modelName}s`);
    }
  }

  /**
   * Check if any document matches the filter.
   *
   * @param filter - MongoDB filter query
   * @returns Whether a matching document exists
   */
  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const document = await this.model.exists(filter);
      return document !== null;
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to check existence of ${this.modelName}`);
    }
  }

  /**
   * Count documents matching the filter.
   *
   * @param filter - MongoDB filter query
   * @returns Number of matching documents
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to count ${this.modelName}s`);
    }
  }

  // ─── Create Operations ─────────────────────────────

  /**
   * Create a new document.
   *
   * @param data - Document data (partial, without _id/timestamps)
   * @param options - Create options (session)
   * @returns The created document
   */
  async create(data: Partial<T>, options: CreateOptions = {}): Promise<T> {
    try {
      const document = new this.model(data);

      if (options.session) {
        document.$session(options.session);
      }

      return (await document.save()) as unknown as T;
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to create ${this.modelName}`);
    }
  }

  /**
   * Create multiple documents in bulk.
   *
   * @param data - Array of document data
   * @param options - Create options (session)
   * @returns Array of created documents
   */
  async createMany(data: Partial<T>[], options: CreateOptions = {}): Promise<T[]> {
    try {
      const docs = await this.model.insertMany(data, {
        session: options.session,
      });

      return docs as unknown as T[];
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to create multiple ${this.modelName}s`);
    }
  }

  /**
   * Find a document and update it, or create if not found.
   *
   * @param filter - Filter to find the document
   * @param data - Update or insert data
   * @param options - Query options
   * @returns The updated or created document
   */
  async upsert(filter: FilterQuery<T>, data: UpdateQuery<T>, options: UpdateOptions = {}): Promise<T> {
    try {
      const result = await this.model.findOneAndUpdate(filter, data, {
        new: true,
        upsert: true,
        session: options.session,
        runValidators: true,
      });

      return result as unknown as T;
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to upsert ${this.modelName}`);
    }
  }

  // ─── Update Operations ─────────────────────────────

  /**
   * Update a document by ID.
   *
   * @param id - MongoDB ObjectId as string
   * @param data - Update data
   * @param options - Update options (session, return new)
   * @returns The updated document or null
   */
  async updateById(id: string, data: UpdateQuery<T>, options: UpdateOptions = {}): Promise<T | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new QueryError(`Invalid ID format: ${id}`);
      }

      const doc = await this.model.findByIdAndUpdate(id, data, {
        new: options.new ?? true,
        session: options.session,
        runValidators: true,
      });

      return doc as unknown as T | null;
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to update ${this.modelName}: ${id}`);
    }
  }

  /**
   * Update a document by ID or throw if not found.
   *
   * @param id - MongoDB ObjectId as string
   * @param data - Update data
   * @param options - Update options
   * @returns The updated document
   * @throws NotFoundError if document doesn't exist
   */
  async updateByIdOrThrow(id: string, data: UpdateQuery<T>, options: UpdateOptions = {}): Promise<T> {
    const document = await this.updateById(id, data, options);

    if (!document) {
      throw new NotFoundError(this.modelName, id);
    }

    return document;
  }

  /**
   * Update documents matching a filter.
   *
   * @param filter - Filter to match documents
   * @param data - Update data
   * @param options - Update options
   * @returns Number of modified documents
   */
  async updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>, options: UpdateOptions = {}): Promise<number> {
    try {
      const result = await this.model.updateMany(filter, data, {
        session: options.session,
      });

      return result.modifiedCount;
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to update ${this.modelName}s`);
    }
  }

  // ─── Delete Operations ─────────────────────────────

  /**
   * Delete a document by ID.
   *
   * @param id - MongoDB ObjectId as string
   * @param options - Delete options (session)
   * @returns Whether a document was deleted
   */
  async deleteById(id: string, options: DeleteOptions = {}): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new QueryError(`Invalid ID format: ${id}`);
      }

      const result = await this.model.findByIdAndDelete(id, {
        session: options.session,
      });

      return result !== null;
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to delete ${this.modelName}: ${id}`);
    }
  }

  /**
   * Delete a document by ID or throw if not found.
   *
   * @param id - MongoDB ObjectId as string
   * @param options - Delete options
   * @throws NotFoundError if document doesn't exist
   */
  async deleteByIdOrThrow(id: string, options: DeleteOptions = {}): Promise<void> {
    const deleted = await this.deleteById(id, options);

    if (!deleted) {
      throw new NotFoundError(this.modelName, id);
    }
  }

  /**
   * Delete documents matching a filter.
   *
   * @param filter - Filter to match documents
   * @param options - Delete options
   * @returns Number of deleted documents
   */
  async deleteMany(filter: FilterQuery<T>, options: DeleteOptions = {}): Promise<number> {
    try {
      const result = await this.model.deleteMany(filter, {
        session: options.session,
      });

      return result.deletedCount;
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to delete ${this.modelName}s`);
    }
  }

  /**
   * Soft-delete a document by setting a deletedAt field.
   * Override this in feature repositories for custom soft-delete behavior.
   *
   * @param id - MongoDB ObjectId as string
   * @param deletedBy - User ID who deleted the document
   * @returns The soft-deleted document or null
   */
  async softDeleteById(id: string, deletedBy?: string): Promise<T | null> {
    try {
      return await this.updateById(id, {
        deletedAt: new Date().toISOString(),
        isDeleted: true,
        ...(deletedBy ? { deletedBy } : {}),
      } as unknown as UpdateQuery<T>);
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to soft-delete ${this.modelName}: ${id}`);
    }
  }

  // ─── Pagination ─────────────────────────────────────

  /**
   * Find documents with pagination and sorting.
   *
   * @param filter - MongoDB filter query
   * @param pagination - Pagination and sorting parameters
   * @param options - Query options (select, populate)
   * @returns Paginated result with data and metadata
   */
  async findPaginated(
    filter: FilterQuery<T> = {},
    pagination: PaginationQuery = {},
    options: FindOptions = {},
  ): Promise<PaginatedResponse<T>> {
    try {
      const page = Math.max(1, pagination.page ?? 1);
      const pageSize = Math.min(100, Math.max(1, pagination.pageSize ?? 10));
      const skip = (page - 1) * pageSize;

      // Build sort object
      let sort: Record<string, 1 | -1> = {};

      if (pagination.sort && pagination.sort.length > 0) {
        for (const field of pagination.sort) {
          sort[field.field] = field.direction === "desc" ? -1 : 1;
        }
      } else if (pagination.sortBy) {
        sort[pagination.sortBy] = pagination.sortOrder === "desc" ? -1 : 1;
      } else {
        sort = { createdAt: -1 };
      }

      // Run count + query in parallel
      const [total, data] = await Promise.all([
        this.model.countDocuments(filter),
        this.findMany(filter, {
          ...options,
          sort,
          skip,
          limit: pageSize,
        }),
      ]);

      const totalPages = Math.ceil(total / pageSize);

      const result: PaginatedResponse<T> = {
        success: true,
        message: `${this.modelName}s retrieved successfully`,
        data,
        pagination: {
          total,
          page,
          pageSize,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      };

      return result;
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to paginate ${this.modelName}s`);
    }
  }

  // ─── Aggregation ────────────────────────────────────

  /**
   * Run an aggregation pipeline.
   *
   * @param pipeline - Aggregation pipeline stages
   * @returns Aggregation results
   */
  async aggregate<R = Record<string, unknown>>(pipeline: PipelineStage[]): Promise<R[]> {
    try {
      const result = await this.model.aggregate<R>(pipeline).exec();
      return result;
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to aggregate ${this.modelName}s`);
    }
  }

  /**
   * Run an aggregation pipeline with pagination ($facet-based).
   *
   * @param pipeline - Aggregation pipeline stages (before $facet)
   * @param pagination - Pagination parameters
   * @returns Paginated aggregation results
   */
  async aggregatePaginated<R = Record<string, unknown>>(
    pipeline: PipelineStage[],
    pagination: { page?: number; pageSize?: number } = {},
  ): Promise<AggregatedPaginatedResult<R>> {
    try {
      const page = Math.max(1, pagination.page ?? 1);
      const pageSize = Math.min(100, Math.max(1, pagination.pageSize ?? 10));
      const skip = (page - 1) * pageSize;

      const facetPipeline: PipelineStage[] = [
        ...pipeline,
        {
          $facet: {
            data: [{ $skip: skip }, { $limit: pageSize }],
            meta: [{ $count: "total" }],
          },
        } as PipelineStage,
      ];

      const result = await this.model.aggregate<{
        data: R[];
        meta: { total: number }[];
      }>(facetPipeline).exec();

      const data = result[0]?.data ?? [];
      const total = result[0]?.meta[0]?.total ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        data,
        meta: {
          total,
          page,
          pageSize,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to aggregate paginated ${this.modelName}s`);
    }
  }

  // ─── Bulk Operations ───────────────────────────────

  /**
   * Execute bulk write operations.
   *
   * @param operations - Array of bulk write operations
   * @returns Bulk write result summary
   */
  async bulkWrite(operations: AnyBulkWriteOperation<T>[]): Promise<BulkWriteResult> {
    try {
      const result = await this.model.bulkWrite(operations as any);

      return {
        insertedCount: result.insertedCount,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        deletedCount: result.deletedCount,
        acknowledged: result.isOk(),
      };
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to bulk write ${this.modelName}s`);
    }
  }

  // ─── Utility Operations ────────────────────────────

  /**
   * Get distinct values for a field.
   *
   * @param field - Field name
   * @param filter - Filter query
   * @returns Array of distinct values
   */
  async distinct(field: string, filter: FilterQuery<T> = {}): Promise<unknown[]> {
    try {
      return await this.model.distinct(field, filter).exec();
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to get distinct values for ${field}`);
    }
  }

  /**
   * Start a new session for transactions.
   *
   * @returns A MongoDB client session
   */
  async startSession(): Promise<ClientSession> {
    return this.model.db.startSession();
  }
}
