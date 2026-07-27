// ─── Environment Variable Validation ─────────────────────────
// This file validates all environment variables at startup using Zod.
// If a required variable is missing, the application will fail fast
// with a clear error message.
//
// Server-only vars (no NEXT_PUBLIC_ prefix) are only available on the server.
// Client vars (NEXT_PUBLIC_ prefix) are inlined at build time.
//
// Usage:
//   import { env } from "@/config/env";
//   env.MONGODB_URI;          // server-only
//   env.NEXT_PUBLIC_APP_URL;  // available on client too

import { z } from "zod";

// ─── Schema Definition ──────────────────────────────────────

const serverSchema = z.object({
  // ─── Database ───
  MONGODB_URI: z
    .string()
    .url("MONGODB_URI must be a valid MongoDB connection URL"),

  // ─── Authentication ───
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters long"),
  AUTH_URL: z
    .string()
    .url()
    .default("http://localhost:3000"),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  AUTH_GITHUB_ID: z.string().optional(),
  AUTH_GITHUB_SECRET: z.string().optional(),

  // ─── Cloudinary (server-side) ───
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // ─── Email (Resend) ───
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z
    .string()
    .email("RESEND_FROM_EMAIL must be a valid email")
    .default("noreply@example.com"),

  // ─── Encryption ───
  ENCRYPTION_KEY: z
    .string()
    .min(32, "ENCRYPTION_KEY must be at least 32 characters")
    .optional(),

  // ─── Runtime ───
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const clientSchema = z.object({
  // ─── Application ───
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z
    .string()
    .min(1, "NEXT_PUBLIC_APP_NAME is required")
    .default("Universal Next.js Boilerplate"),
  NEXT_PUBLIC_APP_DESCRIPTION: z
    .string()
    .min(1)
    .default("A production-ready Next.js boilerplate."),

  // ─── Cloudinary (client-side) ───
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
});

// ─── Merge ──────────────────────────────────────────────────

const envSchema = serverSchema.merge(clientSchema);

// ─── Type Exports ───────────────────────────────────────────

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;
export type Env = z.infer<typeof envSchema>;

// ─── Build-time Validation ──────────────────────────────────

/**
 * Validates environment variables at build time.
 * Call this in next.config.ts to fail fast during build.
 *
 * @example
 * // next.config.ts
 * import { validateEnv } from "@/config/env";
 * validateEnv();
 */
export function validateEnv(): void {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const messages = Object.entries(errors)
      .map(([key, msgs]) => `  • ${key}: ${msgs?.join(", ")}`)
      .join("\n");
    console.error("\n❌ Environment variable validation failed:\n\n" + messages + "\n");
    throw new Error("Environment validation failed. Check your .env.local file.");
  }
}

// ─── Parsed Environment ─────────────────────────────────────

/**
 * Parsed and validated environment variables.
 * Use this instead of `process.env` throughout the application.
 *
 * @example
 * import { env } from "@/config/env";
 * console.log(env.MONGODB_URI);
 * console.log(env.NEXT_PUBLIC_APP_URL);
 */
function createEnv(): Env {
  // On the client, only NEXT_PUBLIC_ vars are available
  const isServer = typeof window === "undefined";

  const parsed = isServer
    ? envSchema.safeParse(process.env)
    : clientSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const messages = Object.entries(errors)
      .map(([key, msgs]) => `  • ${key}: ${msgs?.join(", ")}`)
      .join("\n");
    console.error("\n❌ Environment variable validation failed:\n\n" + messages + "\n");
    throw new Error("Invalid environment variables. Check your .env.local file.");
  }    // Merge for client: server vars get undefined as placeholders
    if (!isServer) {
      return {
        ...Object.fromEntries(Object.keys(serverSchema.shape).map((k) => [k, undefined])),
        ...parsed.data,
      } as Env;
    }

  return parsed.data as Env;
}

/**
 * Singleton env object — validated once at module import time.
 */
export const env: Env = createEnv();
