/**
 * JSON-LD structured data component for rich search results.
 *
 * Injects schema.org structured data into the page head.
 * Supports multiple structured data types via helper functions.
 *
 * @example
 * // Single entity
 * <JsonLd data={organizationSchema} />
 *
 * // Multiple entities
 * <JsonLd data={[organizationSchema, websiteSchema]} />
 *
 * // Using helper
 * <JsonLd data={JsonLd.website()} />
 */

import React from "react";
import { seoFeatureConfig } from "../config";
import { SCHEMA_TYPES } from "../constants";
import type {
  IJsonLd,
  IOrganizationSchema,
  IWebsiteSchema,
  IBreadcrumbSchema,
  IArticleSchema,
  IFaqPageSchema,
} from "../types";

export interface JsonLdProps {
  /** Single or multiple JSON-LD objects. */
  data: IJsonLd | IJsonLd[];
}

export function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}
    </>
  );
}

// ─── Schema Helpers ──────────────────────────────────

/**
 * Build an Organization schema.
 * Overrides are applied first, then core fields are set definitively.
 */
JsonLd.organization = (
  overrides?: Partial<IOrganizationSchema>,
): IOrganizationSchema => ({
  ...overrides,
  "@context": "https://schema.org",
  "@type": SCHEMA_TYPES.ORGANIZATION,
  name: overrides?.name ?? seoFeatureConfig.organizationName,
  url: overrides?.url ?? seoFeatureConfig.organizationUrl,
});

/**
 * Build a WebSite schema (with optional search action).
 */
JsonLd.website = (
  searchUrl?: string,
  overrides?: Partial<IWebsiteSchema>,
): IWebsiteSchema => ({
  ...overrides,
  "@context": "https://schema.org",
  "@type": SCHEMA_TYPES.WEBSITE,
  name: overrides?.name ?? seoFeatureConfig.defaultTitle,
  url: overrides?.url ?? seoFeatureConfig.baseUrl,
  ...(searchUrl && {
    potentialAction: {
      "@type": "SearchAction",
      target: `${searchUrl}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }),
});

/**
 * Build a BreadcrumbList schema from path segments.
 */
JsonLd.breadcrumbs = (
  items: { name: string; url: string }[],
): IBreadcrumbSchema => ({
  "@context": "https://schema.org",
  "@type": SCHEMA_TYPES.BREADCRUMB_LIST,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url.startsWith("http")
      ? item.url
      : `${seoFeatureConfig.baseUrl}${item.url}`,
  })),
});

/**
 * Build an Article schema.
 * Overrides are spread first so core fields take precedence.
 */
JsonLd.article = (overrides: IArticleSchema): IArticleSchema => ({
  ...overrides,
  "@context": "https://schema.org",
  "@type": SCHEMA_TYPES.ARTICLE,
  headline: overrides.headline,
  description: overrides.description,
});

/**
 * Build an FAQPage schema.
 */
JsonLd.faqPage = (
  questions: { question: string; answer: string }[],
): IFaqPageSchema => ({
  "@context": "https://schema.org",
  "@type": SCHEMA_TYPES.FAQ_PAGE,
  mainEntity: questions.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: q.answer,
    },
  })),
});
