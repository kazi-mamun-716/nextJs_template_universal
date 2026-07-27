/**
 * SEO Feature — Public API
 */

// Components
export { JsonLd } from "./components/json-ld";
export { MetaTags } from "./components/meta-tags";

// Services
export { metadataGenerator } from "./services/metadata-generator";
export { sitemapGenerator } from "./services/sitemap-generator";
export { robotsGenerator } from "./services/robots-generator";

// Types
export type { ISEOMetadata, IOpenGraph, ITwitterCard, IJsonLd } from "./types";

// Config
export { seoFeatureConfig } from "./config";
