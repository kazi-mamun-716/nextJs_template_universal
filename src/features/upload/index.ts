/**
 * Upload Feature — Public API
 *
 * Export surface for all upload-related functionality.
 * Import from this barrel instead of deep-importing internal files.
 *
 * @example
 * import { cloudinaryService, ImageUpload, UPLOAD_FOLDERS } from "@/features/upload";
 */

// ─── Components ──────────────────────────────────────
export { ImageUpload, type ImageUploadProps } from "./components/image-upload";
export { FileUpload, type FileUploadProps } from "./components/file-upload";
export { UploadPreview, type UploadPreviewProps } from "./components/upload-preview";

// ─── Server Actions ──────────────────────────────────
export { upload } from "./actions/upload";
export { deleteFile } from "./actions/delete";

// ─── Services ────────────────────────────────────────
export { cloudinaryService } from "./services/cloudinary-service";

// ─── Types ───────────────────────────────────────────
export type {
  IUploadResult,
  IUploadError,
  UploadOptions,
  UploadState,
  FileValidationResult,
} from "./types";

// ─── Constants ───────────────────────────────────────
export {
  UPLOAD_FOLDERS,
  UPLOAD_MESSAGES,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_DOCUMENT_TYPES,
  UPLOAD_SIZE_LIMITS,
  DEFAULT_UPLOAD_OPTIONS,
} from "./constants";

// ─── Config ──────────────────────────────────────────
export { uploadFeatureConfig } from "./config";

// ─── Hooks ───────────────────────────────────────────
export { useUpload, type UseUploadOptions } from "./hooks/use-upload";

// ─── Validation Utils ────────────────────────────────
export { validateFile, formatFileSize, isImageFile, isDocumentFile } from "./utils/validation";
