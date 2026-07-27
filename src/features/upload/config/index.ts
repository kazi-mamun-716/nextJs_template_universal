/**
 * Upload feature configuration.
 */
export const uploadFeatureConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"] as string[],
  allowedDocumentFormats: ["application/pdf", "text/plain"] as string[],
  cloudinary: {
    folder: "uploads",
    transformations: {
      avatar: { width: 200, height: 200, crop: "fill" },
      thumbnail: { width: 150, height: 150, crop: "thumb" },
    },
  },
} as const;
