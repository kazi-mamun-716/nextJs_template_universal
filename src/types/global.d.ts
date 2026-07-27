/**
 * Global type augmentations and ambient declarations.
 *
 * This file extends existing types with project-specific additions.
 * It is automatically included by TypeScript without explicit imports.
 *
 * @module global
 */

// ─── NodeJS Environment Variables ─────────────────────────
// Extends ProcessEnv with typed env vars from config/env.ts

declare namespace NodeJS {
  interface ProcessEnv {
    // Application
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_DESCRIPTION: string;

    // Database
    MONGODB_URI: string;

    // Authentication
    AUTH_SECRET: string;
    AUTH_URL: string;
    AUTH_GOOGLE_ID?: string;
    AUTH_GOOGLE_SECRET?: string;
    AUTH_GITHUB_ID?: string;
    AUTH_GITHUB_SECRET?: string;

    // Cloudinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;

    // Email (Resend)
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;

    // Encryption
    ENCRYPTION_KEY?: string;

    // Runtime
    NODE_ENV: "development" | "production" | "test";
  }
}

// ─── Window Extensions ────────────────────────────────────
// Adds custom properties to the Window object for client-only features.

declare interface Window {
  /** Google Analytics or similar client-side analytics. */
  gtag?: (...args: unknown[]) => void;
  /** DataLayer for Google Tag Manager. */
  dataLayer?: unknown[];
  /** Cloudinary upload widget. */
  cloudinary?: unknown;
  /** Client-side feature flags. */
  __FEATURE_FLAGS__?: Record<string, boolean>;
}

// ─── Import Meta (for asset URLs) ─────────────────────────

declare interface ImportMeta {
  /** Environment variables accessible on both client and server. */
  readonly env: {
    readonly NEXT_PUBLIC_APP_URL?: string;
    readonly NEXT_PUBLIC_APP_NAME?: string;
    [key: `NEXT_PUBLIC_${string}`]: string | undefined;
  };
}

// ─── Mongoose Extensions ──────────────────────────────────
// Adds type safety for Mongoose document transformations.

declare module "mongoose" {
  interface Document {
    /** JSON serialization with consistent id field. */
    toJSON(): Record<string, unknown>;
  }
}
