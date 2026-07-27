/**
 * File upload configuration.
 *
 * Controls upload behavior, supported file types, and Cloudinary settings.
 */
export const uploadConfig = {
  /** Maximum file size in bytes (10 MB) */
  maxFileSize: 10 * 1024 * 1024,

  /** Allowed image MIME types */
  allowedImageFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"] as const,

  /** Allowed document MIME types */
  allowedDocumentFormats: ["application/pdf", "text/plain"] as const,

  /** Default Cloudinary folder path */
  cloudinaryFolder: "uploads",

  /** Image transformation presets */
  transforms: {
    avatar: { width: 200, height: 200, crop: "fill" } as const,
    thumbnail: { width: 150, height: 150, crop: "thumb" } as const,
    banner: { width: 1200, height: 400, crop: "fill" } as const,
  },
} as const;

export type UploadConfig = typeof uploadConfig;
