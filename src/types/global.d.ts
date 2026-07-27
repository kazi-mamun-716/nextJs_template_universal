/**
 * Global type augmentations for the application.
 */

// Extend NodeJS.ProcessEnv for typed environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_DESCRIPTION: string;
    MONGODB_URI: string;
    AUTH_SECRET: string;
    AUTH_URL: string;
    AUTH_GOOGLE_ID?: string;
    AUTH_GOOGLE_SECRET?: string;
    AUTH_GITHUB_ID?: string;
    AUTH_GITHUB_SECRET?: string;
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
    ENCRYPTION_KEY?: string;
    NODE_ENV: "development" | "production" | "test";
  }
}
