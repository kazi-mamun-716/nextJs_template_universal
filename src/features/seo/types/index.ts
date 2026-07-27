/**
 * SEO feature type definitions.
 *
 * Organised into:
 * - ISEOMetadata: Core page-level SEO data
 * - IOpenGraph: Open Graph protocol data
 * - ITwitterCard: Twitter Card data
 * - IJsonLd / *Schema: Structured data types
 * - SEOProps: Component-level SEO props
 */

// ─── Core Metadata ─────────────────────────────────────

/** Core SEO metadata for a page. */
export interface ISEOMetadata {
  title: string;
  description: string;
  /** Custom canonical URL override. Falls back to current URL. */
  canonical?: string;
  /** Whether to allow indexing (default: true). */
  indexable?: boolean;
  /** Optional JSON-LD structured data. */
  jsonLd?: IJsonLd | IJsonLd[];
}

// ─── OpenGraph ─────────────────────────────────────────

export interface IOpenGraph {
  title: string;
  description: string;
  /** OG image URL (absolute). */
  image?: string;
  /** Page URL (absolute). */
  url: string;
  /** og:type (default: "website"). */
  type?: string;
  /** Site name for OG. */
  siteName?: string;
  /** Locale (default: "en_US"). */
  locale?: string;
}

// ─── Twitter Card ──────────────────────────────────────

export interface ITwitterCard {
  card: "summary" | "summary_large_image" | "app" | "player";
  title: string;
  description: string;
  /** Twitter handle (with @). */
  site?: string;
  /** Image URL for the card. */
  image?: string;
  /** Image alt text. */
  imageAlt?: string;
}

// ─── Canonical ─────────────────────────────────────────

export interface ICanonicalConfig {
  /** Base URL of the site (no trailing slash). */
  baseUrl: string;
  /** Default trailing slash behaviour. */
  trailingSlash?: boolean;
}

// ─── Structured Data (JSON-LD) ─────────────────────────

export interface IJsonLd {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

export interface IOrganizationSchema extends IJsonLd {
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

export interface IWebsiteSchema extends IJsonLd {
  "@type": "WebSite";
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

export interface IBreadcrumbSchema extends IJsonLd {
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }[];
}

export interface IArticleSchema extends IJsonLd {
  "@type": "Article";
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    "@type": "Person" | "Organization";
    name: string;
  };
}

export interface IFaqPageSchema extends IJsonLd {
  "@type": "FAQPage";
  mainEntity: {
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }[];
}

// ─── Component Props ───────────────────────────────────

/** Props for page-level SEO components. */
export interface SEOProps {
  /** Page-specific SEO metadata. */
  seo: ISEOMetadata;
  /** Open Graph overrides. */
  openGraph?: Partial<IOpenGraph>;
  /** Twitter Card overrides. */
  twitter?: Partial<ITwitterCard>;
  /** Whether to merge with defaults (default: true). */
  inheritDefaults?: boolean;
}

/** Props for a sitemap entry. */
export interface ISitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}
