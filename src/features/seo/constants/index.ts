/**
 * SEO feature constants.
 *
 * Centralises default values for OpenGraph images, Twitter handles,
 * schema.org types, and common static page definitions.
 */

import { appConfig } from "@/config/app";

// ─── Default Images ───────────────────────────────────

export const SEO_IMAGES = {
  /** Default OpenGraph image for the homepage. */
  DEFAULT_OG: `${appConfig.url}/og-image.png`,
  /** Default Twitter Card image. */
  DEFAULT_TWITTER: `${appConfig.url}/twitter-image.png`,
  /** Default favicon path. */
  FAVICON: "/favicon.ico",
} as const;

// ─── Social ───────────────────────────────────────────

export const SEO_SOCIAL = {
  /** Default Twitter handle (without @). */
  TWITTER_HANDLE: "@yourhandle",
  /** Default Facebook/OG locale. */
  LOCALE: "en_US",
  /** Default OG type. */
  OG_TYPE: "website",
} as const;

// ─── Schema Types ─────────────────────────────────────

export const SCHEMA_TYPES = {
  ORGANIZATION: "Organization",
  WEBSITE: "WebSite",
  ARTICLE: "Article",
  BREADCRUMB_LIST: "BreadcrumbList",
  FAQ_PAGE: "FAQPage",
  PRODUCT: "Product",
  PERSON: "Person",
} as const;

// ─── Change Frequency Values ──────────────────────────

export const SITEMAP_CHANGE_FREQ = {
  ALWAYS: "always",
  HOURLY: "hourly",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
  NEVER: "never",
} as const;

// ─── Static Pages for Sitemap ─────────────────────────

export const STATIC_PAGES = [
  { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { url: "/about", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/contact", priority: 0.3, changeFrequency: "monthly" as const },
  { url: "/pricing", priority: 0.7, changeFrequency: "weekly" as const },
  { url: "/faq", priority: 0.4, changeFrequency: "monthly" as const },
  { url: "/blog", priority: 0.8, changeFrequency: "daily" as const },
  { url: "/login", priority: 0.2, changeFrequency: "yearly" as const },
  { url: "/register", priority: 0.2, changeFrequency: "yearly" as const },
  { url: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
] as const;
