/**
 * Base model type definitions for database documents.
 *
 * These types define the shape of persisted data throughout the application.
 * Feature-specific models should extend these base interfaces.
 *
 * @example
 * import type { IBaseModel, ITimestamp } from "@/types/models";
 *
 * export interface IUser extends IBaseModel {
 *   email: string;
 *   name: string;
 * }
 */

// ─── Timestamps ──────────────────────────────────────────

/** Standard timestamp fields for all documents. */
export interface ITimestamp {
  /** ISO date string of when the document was created. */
  createdAt: string;
  /** ISO date string of when the document was last updated. */
  updatedAt: string;
}

/** Soft-delete timestamp fields. */
export interface ISoftDelete {
  /** ISO date string of when the document was deleted (null = not deleted). */
  deletedAt: string | null;
  /** Whether the document is marked as deleted. */
  isDeleted: boolean;
}

// ─── Base Model ──────────────────────────────────────────

/** Base model with id and timestamps. */
export interface IBaseModel extends ITimestamp {
  /** Unique identifier (MongoDB ObjectId as string). */
  _id: string;
  /** Unique identifier alias for convenience. */
  id: string;
}

/** Base model with soft-delete support. */
export interface IBaseModelWithSoftDelete extends IBaseModel, ISoftDelete {}

// ─── Auditable ───────────────────────────────────────────

/** Audit trail fields for tracking who made changes. */
export interface IAuditable {
  /** User ID who created the document. */
  createdBy: string;
  /** User ID who last updated the document. */
  updatedBy: string;
  /** User ID who deleted the document (if soft-deleted). */
  deletedBy?: string;
}

// ─── Status ──────────────────────────────────────────────

/** Common publishable content statuses. */
export type ContentStatus = "draft" | "published" | "archived" | "scheduled";

/** Common account/user statuses. */
export type AccountStatus = "active" | "inactive" | "suspended" | "pending";

/** Common verification statuses. */
export type VerificationStatus = "unverified" | "verified" | "expired";

// ─── Config ──────────────────────────────────────────────

/** Key-value pair for persisted settings. */
export interface IConfigEntry {
  key: string;
  value: unknown;
  description?: string;
}

/** Versioned document for conflict resolution. */
export interface IVersioned {
  /** Document version number (incremented on each update). */
  __v: number;
}
