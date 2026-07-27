/**
 * SEO feature configuration.
 *
 * Centralises default values for all SEO-related settings.
 * Used by the metadata generator, sitemap generator, and components.
 */

import { appConfig } from "@/config/app";
import { SEO_IMAGES, SEO_SOCIAL, STATIC_PAGES } from "../constants";

export const seoFeatureConfig = {
  /** Default site title. */
  defaultTitle: appConfig.name,

  /** Page title template: "Page Name | Site Name". */
  titleTemplate: `%s | ${appConfig.name}`,

  /** Default meta description. */
  defaultDescription: appConfig.description,

  /** Canonical base URL from env. */
  baseUrl: appConfig.url,

  /** Default OpenGraph image URL. */
  defaultOgImage: SEO_IMAGES.DEFAULT_OG,

  /** Default Twitter Card image URL. */
  defaultTwitterImage: SEO_IMAGES.DEFAULT_TWITTER,

  /** Twitter handle (with @). */
  twitterHandle: SEO_SOCIAL.TWITTER_HANDLE,

  /** Default locale for OG tags. */
  locale: SEO_SOCIAL.LOCALE,

  /** Default OG type. */
  siteType: SEO_SOCIAL.OG_TYPE,

  /** Organization name for structured data. */
  organizationName: appConfig.name,

  /** Organization URL. */
  organizationUrl: appConfig.url,

  /** Static pages for sitemap generation. */
  staticPages: STATIC_PAGES,

  /** Robots defaults. */
  robots: {
    index: true,
    follow: true,
  },
} as const;

export type SEOFeatureConfig = typeof seoFeatureConfig;
