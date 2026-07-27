/**
 * SEO Feature — Public API
 *
 * Export surface for all SEO-related functionality.
 * Import from this barrel instead of deep-importing internal files.
 *
 * @example
 * import { metadataGenerator, JsonLd, SEO_IMAGES } from "@/features/seo";
 */

// ─── Components ──────────────────────────────────────
export { JsonLd, type JsonLdProps } from "./components/json-ld";
export { MetaTags, type MetaTagsProps } from "./components/meta-tags";

// ─── Services ────────────────────────────────────────
export { metadataGenerator } from "./services/metadata-generator";
export { sitemapGenerator, type SitemapSource } from "./services/sitemap-generator";
export { robotsGenerator, type RobotsConfig } from "./services/robots-generator";

// ─── Types ───────────────────────────────────────────
export type {
  ISEOMetadata,
  IOpenGraph,
  ITwitterCard,
  ICanonicalConfig,
  IJsonLd,
  IOrganizationSchema,
  IWebsiteSchema,
  IBreadcrumbSchema,
  IArticleSchema,
  IFaqPageSchema,
  SEOProps,
  ISitemapEntry,
} from "./types";

// ─── Config ──────────────────────────────────────────
export { seoFeatureConfig, type SEOFeatureConfig } from "./config";

// ─── Constants ───────────────────────────────────────
export {
  SEO_IMAGES,
  SEO_SOCIAL,
  SCHEMA_TYPES,
  SITEMAP_CHANGE_FREQ,
  STATIC_PAGES,
} from "./constants";
