/**
 * Client-side file validation utilities.
 *
 * Provides synchronous validation for files before they are uploaded,
 * giving users immediate feedback without waiting for a server round-trip.
 */

import { ACCEPTED_IMAGE_TYPES, UPLOAD_SIZE_LIMITS } from "../constants";
import type { FileValidationResult } from "../types";
import { MESSAGES } from "@/constants/messages";

export interface ValidateFileOptions {
  /** Allowed MIME types (default: ACCEPTED_IMAGE_TYPES). */
  allowedTypes?: readonly string[];
  /** Maximum file size in bytes (default: UPLOAD_SIZE_LIMITS.IMAGE). */
  maxSize?: number;
}

/**
 * Validate a File object before upload.
 *
 * Checks:
 * - File exists and is not empty
 * - MIME type is in the allowed list
 * - File size does not exceed the maximum
 *
 * @param file - The File object to validate
 * @param options - Validation options
 * @returns Validation result with error message if invalid
 */
export function validateFile(
  file: File,
  options: ValidateFileOptions = {},
): FileValidationResult {
  const {
    allowedTypes = ACCEPTED_IMAGE_TYPES,
    maxSize = UPLOAD_SIZE_LIMITS.IMAGE,
  } = options;

  if (!file || file.size === 0) {
    return { valid: false, error: "No file selected or file is empty." };
  }

  if (!allowedTypes.includes(file.type as (typeof allowedTypes)[number])) {
    return { valid: false, error: MESSAGES.ERROR.INVALID_FILE_TYPE };
  }

  if (file.size > maxSize) {
    return { valid: false, error: MESSAGES.ERROR.FILE_TOO_LARGE };
  }

  return { valid: true };
}

/**
 * Format file size in human-readable format.
 *
 * @param bytes - File size in bytes
 * @returns Human-readable string like "2.5 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Check if a file type is an image.
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Check if a file type is a document.
 */
export function isDocumentFile(file: File): boolean {
  return (
    file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
}
