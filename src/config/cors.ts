/**
 * CORS configuration for API routes.
 *
 * Controls which origins, methods, and headers are allowed.
 */
import { env } from "@/config/env";

export const corsConfig = {
  /** Allowed origin URLs */
  allowedOrigins: [env.NEXT_PUBLIC_APP_URL],

  /** Allowed HTTP methods */
  allowedMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"] as const,

  /** Allowed request headers */
  allowedHeaders: ["Content-Type", "Authorization"] as const,

  /** Whether to include credentials in CORS requests */
  credentials: true,
} as const;

export type CorsConfig = typeof corsConfig;
