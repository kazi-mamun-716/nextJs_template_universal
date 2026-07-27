/**
 * Users feature configuration.
 */
export const usersFeatureConfig = {
  defaultPageSize: 20,
  maxPageSize: 100,
  avatar: {
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedFormats: ["image/jpeg", "image/png", "image/webp"] as string[],
  },
};
