/**
 * File upload configuration.
 */
export const uploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  allowedDocumentFormats: ["application/pdf", "text/plain"],
  cloudinaryFolder: "uploads",
} as const;
