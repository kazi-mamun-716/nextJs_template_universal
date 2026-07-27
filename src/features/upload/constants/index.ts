/**
 * Upload feature constants.
 *
 * Centralises folder paths, transformation presets, and file-type
 * metadata that the upload service, components, and API routes reference.
 */

import type { UploadOptions } from "../types";

// ─── Folder Paths ──────────────────────────────────────
// Organise Cloudinary folders by domain.

export const UPLOAD_FOLDERS = {
  /** General / miscellaneous uploads. */
  GENERAL: "uploads",
  /** User avatar images. */
  AVATARS: "users/avatars",
  /** Blog / article images. */
  ARTICLES: "articles/images",
  /** Email campaign assets. */
  EMAILS: "emails",
  /** CMS media library. */
  MEDIA: "media",
} as const;

// ─── Default Upload Options ────────────────────────────
// Sensible defaults that can be overridden per call.

export const DEFAULT_UPLOAD_OPTIONS: UploadOptions = {
  folder: UPLOAD_FOLDERS.GENERAL,
  optimize: true,
  resourceType: "image",
  overwrite: true,
  invalidate: true,
};

// ─── File Type Configuration ───────────────────────────

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

// ─── Size Limits (in bytes) ────────────────────────────

export const UPLOAD_SIZE_LIMITS = {
  /** Max avatar image size (2 MB). */
  AVATAR: 2 * 1024 * 1024,
  /** Max general image size (10 MB). */
  IMAGE: 10 * 1024 * 1024,
  /** Max document size (20 MB). */
  DOCUMENT: 20 * 1024 * 1024,
} as const;

// ─── Messages ──────────────────────────────────────────

export const UPLOAD_MESSAGES = {
  UPLOAD_SUCCESS: "File uploaded successfully.",
  UPLOAD_FAILED: "Failed to upload file.",
  FILE_TOO_LARGE: "File exceeds the maximum upload size.",
  INVALID_FILE_TYPE: "File type is not supported.",
  DELETE_SUCCESS: "File deleted successfully.",
  DELETE_FAILED: "Failed to delete file.",
  UPLOADING: "Uploading...",
  PROCESSING: "Processing image...",
  DRAG_DROP: "Drag a file here, or click to browse.",
  SELECT_IMAGE: "Select an image to upload.",
  AVATAR_UPLOADED: "Avatar updated successfully.",
} as const;
