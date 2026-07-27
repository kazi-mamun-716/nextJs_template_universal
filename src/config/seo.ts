/**
 * SEO configuration defaults.
 *
 * Controls metadata generation, OpenGraph, Twitter Cards, and structured data.
 * Values are referenced by the SEO feature for consistent output.
 */
import { appConfig } from "@/config/app";

export const seoConfig = {
  /** Default page title */
  defaultTitle: appConfig.name,

  /** Default meta description */
  defaultDescription: appConfig.description,

  /** Default OpenGraph image URL */
  defaultOgImage: `${appConfig.url}/og-image.png`,

  /** Twitter handle for Twitter Cards */
  twitterHandle: "@yourhandle",

  /** Content locale */
  locale: "en_US",

  /** Site type for OpenGraph */
  siteType: "website" as const,

  /** Default robots rules */
  robots: {
    index: true,
    follow: true,
  },
} as const;

export type SeoConfig = typeof seoConfig;
