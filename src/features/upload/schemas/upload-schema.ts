/**
 * File upload validation schemas.
 *
 * Provides:
 * - Single-file validation (size, type)
 * - Multiple-file validation
 * - Upload-options validation
 */

import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_DOCUMENT_TYPES,
  UPLOAD_SIZE_LIMITS,
  UPLOAD_FOLDERS,
} from "../constants";
import { MESSAGES } from "@/constants/messages";

// ─── Allowed Upload Folders ────────────────────────────

const ALLOWED_FOLDERS = Object.values(UPLOAD_FOLDERS) as [string, ...string[]];

// ─── Image File Validation ─────────────────────────────

/**
 * Validates a single image file.
 * Checks MIME type and size limits.
 */
export const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size > 0,
    { message: "File cannot be empty." },
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type as typeof ACCEPTED_IMAGE_TYPES[number]),
    { message: MESSAGES.ERROR.INVALID_FILE_TYPE },
  )
  .refine(
    (file) => file.size <= UPLOAD_SIZE_LIMITS.IMAGE,
    { message: MESSAGES.ERROR.FILE_TOO_LARGE },
  );

/**
 * Validates an avatar image file.
 * Stricter size limit (2 MB).
 */
export const avatarFileSchema = imageFileSchema.refine(
  (file) => file.size <= UPLOAD_SIZE_LIMITS.AVATAR,
  { message: "Avatar image must be under 2 MB." },
);

// ─── Document File Validation ──────────────────────────

export const documentFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size > 0,
    { message: "File cannot be empty." },
  )
  .refine(
    (file) => ACCEPTED_DOCUMENT_TYPES.includes(file.type as typeof ACCEPTED_DOCUMENT_TYPES[number]),
    { message: MESSAGES.ERROR.INVALID_FILE_TYPE },
  )
  .refine(
    (file) => file.size <= UPLOAD_SIZE_LIMITS.DOCUMENT,
    { message: MESSAGES.ERROR.FILE_TOO_LARGE },
  );

// ─── Generic File Validation ───────────────────────────

/**
 * Creates a file schema for custom allowed types and size limits.
 */
export function createFileSchema({
  allowedTypes,
  maxSize,
}: {
  allowedTypes: readonly string[];
  maxSize: number;
}) {
  return z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File cannot be empty." })
    .refine(
      (file) => allowedTypes.includes(file.type),
      { message: MESSAGES.ERROR.INVALID_FILE_TYPE },
    )
    .refine(
      (file) => file.size <= maxSize,
      { message: MESSAGES.ERROR.FILE_TOO_LARGE },
    );
}

// ─── Multiple Files ────────────────────────────────────

export const imageFilesSchema = z
  .array(imageFileSchema)
  .min(1, "At least one file is required.")
  .max(10, "Maximum 10 files allowed at once.");

// ─── Upload Options ────────────────────────────────────

export const uploadOptionsSchema = z.object({
  folder: z.enum(ALLOWED_FOLDERS).default(UPLOAD_FOLDERS.GENERAL),
  publicId: z.string().optional(),
  preset: z.enum(["avatar", "thumbnail", "banner"]).optional(),
  optimize: z.boolean().default(true),
  resourceType: z.enum(["image", "raw", "auto"]).default("image"),
  overwrite: z.boolean().default(true),
  invalidate: z.boolean().default(true),
});

export type UploadOptionsInput = z.infer<typeof uploadOptionsSchema>;

// ─── Upload Form Action Schema ─────────────────────────

export const uploadActionSchema = z.object({
  file: imageFileSchema,
  options: uploadOptionsSchema.optional(),
});

export type UploadActionInput = z.infer<typeof uploadActionSchema>;
