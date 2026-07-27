/**
 * Upload feature type definitions.
 *
 * Organised into:
 * - IUploadResult / IUploadError: Raw Cloudinary-level responses
 * - UploadOptions: Upload configuration for service calls
 * - UploadState: Client-side upload tracking
 * - FileValidation: Per-file validation metadata
 */

// ─── Cloudinary Response Types ─────────────────────────

/** Result returned by Cloudinary after a successful upload. */
export interface IUploadResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  /** Secure HTTPS URL provided by Cloudinary. */
  secureUrl?: string;
  /** Original filename before upload. */
  originalFilename?: string;
}

/** Cloudinary error details. */
export interface IUploadError {
  code: string;
  message: string;
}

// ─── Upload Options ────────────────────────────────────

/** Configuration for a single upload operation. */
export interface UploadOptions {
  /** Cloudinary folder path (e.g. "users/avatars"). */
  folder?: string;
  /** Optional public ID override. Auto-generated if omitted. */
  publicId?: string;
  /** Whether to generate an optimized URL on success. Default true. */
  optimize?: boolean;
  /** Image transformation preset from config (e.g. "avatar", "thumbnail"). */
  preset?: string;
  /** Resource type (default: "image"). */
  resourceType?: "image" | "raw" | "auto";
  /** Whether to overwrite an existing file with the same public ID. */
  overwrite?: boolean;
  /** Whether to invalidate CDN cache. */
  invalidate?: boolean;
}

// ─── Client-side Upload State ──────────────────────────

/** Tracks the state of a client-side upload operation. */
export interface UploadState {
  /** Current upload status. */
  status: "idle" | "uploading" | "success" | "error";
  /** Upload progress percentage (0–100). */
  progress: number;
  /** Completed upload result, if successful. */
  result?: IUploadResult | null;
  /** Error message, if failed. */
  error?: string | null;
}

/** Initial / reset upload state. */
export const INITIAL_UPLOAD_STATE: UploadState = {
  status: "idle",
  progress: 0,
  result: null,
  error: null,
};

// ─── File Validation ───────────────────────────────────

/** Result of validating a file before upload. */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}
