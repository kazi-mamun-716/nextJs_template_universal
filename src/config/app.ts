/**
 * Application-wide configuration.
 *
 * All configurable values should be defined here, not hardcoded.
 * Access env-specific values through `env` from "@/config/env".
 */
import { env } from "@/config/env";

export const appConfig = {
  /** Application display name */
  name: env.NEXT_PUBLIC_APP_NAME,

  /** Application short description for SEO and meta tags */
  description: env.NEXT_PUBLIC_APP_DESCRIPTION,

  /** Semantic version of the application */
  version: "0.1.0",

  /** Canonical URL of the application */
  url: env.NEXT_PUBLIC_APP_URL,

  /** Support email displayed to users */
  supportEmail: env.RESEND_FROM_EMAIL,

  /** Copyright notice (auto-updates year) */
  copyright: `© ${new Date().getFullYear()} ${env.NEXT_PUBLIC_APP_NAME}. All rights reserved.`,
} as const;

export type AppConfig = typeof appConfig;
