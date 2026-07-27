/**
 * Application-wide configuration.
 * All configurable values should be defined here, not hardcoded.
 */
export const appConfig = {
  name: "Universal Next.js Boilerplate",
  description: "A production-ready, feature-isolated Next.js boilerplate.",
  version: "0.1.0",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supportEmail: process.env.RESEND_FROM_EMAIL ?? "support@example.com",
  copyright: `© ${new Date().getFullYear()} Universal Next.js Boilerplate. All rights reserved.`,
} as const;
