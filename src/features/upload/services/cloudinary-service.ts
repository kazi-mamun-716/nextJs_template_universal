/**
 * Cloudinary service — handles all file upload operations.
 *
 * Abstracts Cloudinary SDK details from the rest of the application.
 * All components, actions, and API routes interact with this service
 * rather than calling the Cloudinary SDK directly.
 *
 * @example
 * import { cloudinaryService } from "@/features/upload/services/cloudinary-service";
 *
 * // Upload an avatar
 * const result = await cloudinaryService.uploadFile(buffer, {
 *   folder: "users/avatars",
 *   preset: "avatar",
 * });
 *
 * // Delete by URL
 * await cloudinaryService.deleteByUrl(result.url);
 */

import { v2 as cloudinary } from "cloudinary";
import { env } from "@/config/env";
import { UPLOAD_FOLDERS, DEFAULT_UPLOAD_OPTIONS } from "../constants";
import type { IUploadResult, UploadOptions } from "../types";

// ─── SDK Configuration ────────────────────────────────
// Configured once at module load from validated environment variables.

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ─── Helper Functions ─────────────────────────────────

/**
 * Extract the public ID from a Cloudinary URL.
 *
 * Works with URLs like:
 *   https://res.cloudinary.com/cloud-name/image/upload/v123456/folder/public-id.jpg
 *
 * @param url - Full Cloudinary URL
 * @returns Extracted public ID (e.g. "folder/public-id") or null
 */
function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Remove query parameters
    const cleanUrl = url.split("?")[0];

    // Match the upload path segment and everything after it
    // Pattern: /upload/v123456/... or /upload/...
    const match = cleanUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);

    if (!match) return null;

    let publicId = match[1];

    // Remove file extension
    const dotIndex = publicId.lastIndexOf(".");
    if (dotIndex !== -1) {
      publicId = publicId.substring(0, dotIndex);
    }

    return publicId || null;
  } catch {
    return null;
  }
}

/**
 * Merge provided options with defaults.
 */
function mergeOptions(options?: UploadOptions): Required<UploadOptions> {
  return {
    ...DEFAULT_UPLOAD_OPTIONS,
    ...options,
    folder: options?.folder ?? DEFAULT_UPLOAD_OPTIONS.folder ?? UPLOAD_FOLDERS.GENERAL,
    resourceType: options?.resourceType ?? DEFAULT_UPLOAD_OPTIONS.resourceType ?? "image",
  } as Required<UploadOptions>;
}

// ─── Service ───────────────────────────────────────────

class CloudinaryService {
  /**
   * Upload a file to Cloudinary.
   *
   * Accepts a base64 data URI or a remote URL (string), or a Buffer
   * (from server-side file reads). Buffer uploads use Cloudinary's
   * upload_stream under the hood.
   *
   * @param file - File content: Buffer, base64 string, or remote URL
   * @param options - Upload configuration (folder, preset, etc.)
   * @returns Upload result with URL, public ID, and metadata
   *
   * @example
   * const result = await cloudinaryService.uploadFile(buffer, { folder: "avatars" });
   * console.log(result.url); // "https://res.cloudinary.com/..."
   */
  async uploadFile(
    file: Buffer | string,
    options?: UploadOptions,
  ): Promise<IUploadResult> {
    const merged = mergeOptions(options);

    const uploadOptions: Record<string, unknown> = {
      folder: merged.folder,
      resource_type: merged.resourceType,
      overwrite: merged.overwrite,
      invalidate: merged.invalidate,
    };

    // Apply transformation preset if provided
    if (merged.preset) {
      uploadOptions.transformation = getTransformationForPreset(merged.preset);
    }

    // Set public ID if provided
    if (merged.publicId) {
      uploadOptions.public_id = merged.publicId;
    }

    let result: Record<string, unknown>;

    if (Buffer.isBuffer(file)) {
      // Use upload_stream for Buffer inputs
      result = await new Promise<Record<string, unknown>>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult as unknown as Record<string, unknown>);
          },
        );
        stream.end(file);
      });
    } else {
      // Use string upload for base64 data URIs or remote URLs
      result = (await cloudinary.uploader.upload(
        file,
        uploadOptions,
      )) as unknown as Record<string, unknown>;
    }

    return {
      url: (result.secure_url as string) || (result.url as string),
      publicId: result.public_id as string,
      format: result.format as string,
      bytes: result.bytes as number,
      width: result.width as number | undefined,
      height: result.height as number | undefined,
      secureUrl: result.secure_url as string | undefined,
      originalFilename: result.original_filename as string | undefined,
    };
  }

  /**
   * Upload a File object (from a FormData / file input) as a buffer.
   *
   * @param file - File object from the browser
   * @param options - Upload configuration
   * @returns Upload result
   */
  async uploadFileObject(
    file: File,
    options?: UploadOptions,
  ): Promise<IUploadResult> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return this.uploadFile(buffer, options);
  }

  /**
   * Delete a file from Cloudinary by its public ID.
   *
   * @param publicId - Cloudinary public ID (e.g. "folder/public-id")
   * @returns Whether the deletion was successful
   */
  async deleteFile(publicId: string): Promise<boolean> {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    return result.result === "ok";
  }

  /**
   * Delete a file by its full Cloudinary URL.
   * Extracts the public ID automatically.
   *
   * @param url - Full Cloudinary URL
   * @returns Whether the deletion was successful
   */
  async deleteByUrl(url: string): Promise<boolean> {
    const publicId = extractPublicIdFromUrl(url);
    if (!publicId) return false;
    return this.deleteFile(publicId);
  }

  /**
   * Generate an optimised or transformed Cloudinary URL for an existing
   * upload without hitting the Cloudinary API again.
   *
   * @param publicId - Cloudinary public ID
   * @param options - Transformation options
   * @returns Optimised URL string
   *
   * @example
   * cloudinaryService.getOptimizedUrl("users/avatars/abc123", {
   *   width: 200,
   *   height: 200,
   *   crop: "fill",
   *   quality: "auto",
   *   format: "webp",
   * });
   */
  getOptimizedUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string | number;
      format?: string;
      effect?: string;
      radius?: number | string;
    },
  ): string {
    const transformOptions: Record<string, unknown> = {
      secure: true,
      fetch_format: options?.format ?? "auto",
      quality: options?.quality ?? "auto",
    };

    if (options?.width) transformOptions.width = options.width;
    if (options?.height) transformOptions.height = options.height;
    if (options?.crop) transformOptions.crop = options.crop;
    if (options?.effect) transformOptions.effect = options.effect;
    if (options?.radius !== undefined) transformOptions.radius = options.radius;

    return cloudinary.url(publicId, transformOptions);
  }

  /**
   * Get the public ID from a Cloudinary URL.
   *
   * @param url - Full Cloudinary URL
   * @returns Public ID or null if extraction fails
   */
  getPublicId(url: string): string | null {
    return extractPublicIdFromUrl(url);
  }

  /**
   * Get image dimensions (width, height) from Cloudinary.
   *
   * @param publicId - Cloudinary public ID
   * @returns Width and height or null
   */
  async getImageDimensions(
    publicId: string,
  ): Promise<{ width: number; height: number } | null> {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: "image",
      });
      return {
        width: result.width as number,
        height: result.height as number,
      };
    } catch {
      return null;
    }
  }
}

// ─── Transformation Presets ───────────────────────────

/**
 * Map a named preset to a Cloudinary transformation object.
 */
function getTransformationForPreset(preset: string): Record<string, unknown> {
  const presets: Record<string, Record<string, unknown>> = {
    avatar: {
      width: 200,
      height: 200,
      crop: "fill",
      gravity: "face",
      quality: "auto",
      fetch_format: "webp",
    },
    thumbnail: {
      width: 150,
      height: 150,
      crop: "thumb",
      quality: "auto",
      fetch_format: "webp",
    },
    banner: {
      width: 1200,
      height: 400,
      crop: "fill",
      quality: "auto",
      fetch_format: "webp",
    },
  };

  return presets[preset] ?? {};
}

// ─── Singleton Export ──────────────────────────────────

export const cloudinaryService = new CloudinaryService();
