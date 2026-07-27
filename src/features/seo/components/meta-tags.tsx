"use client";

/**
 * MetaTags — head meta tags component for pages that need dynamic SEO.
 *
 * Injects OpenGraph, Twitter Card, canonical URL, and JSON-LD structured
 * data into the page head. Useful for client-rendered pages or pages
 * where metadata needs to change based on user interaction.
 *
 * @example
 * <MetaTags
 *   title="About Us"
 *   description="Learn about our company"
 *   canonical="/about"
 *   ogImage="/about-og.png"
 *   jsonLd={organizationSchema}
 * />
 */

import React from "react";
import { usePathname } from "next/navigation";
import { seoFeatureConfig } from "../config";
import type { IJsonLd } from "../types";

export interface MetaTagsProps {
  /** Page title. */
  title?: string;
  /** Meta description. */
  description?: string;
  /** Canonical path (e.g. "/about"). */
  canonical?: string;
  /** OpenGraph image URL. */
  ogImage?: string;
  /** Twitter card type. */
  twitterCard?: "summary" | "summary_large_image";
  /** JSON-LD structured data. */
  jsonLd?: IJsonLd | IJsonLd[];
  /** Whether to allow indexing. */
  indexable?: boolean;
}

function absoluteUrl(path: string, baseUrl: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function MetaTags({
  title,
  description,
  canonical,
  ogImage,
  twitterCard = "summary_large_image",
  jsonLd,
  indexable = true,
}: MetaTagsProps) {
  const pathname = usePathname();
  const baseUrl = seoFeatureConfig.baseUrl;
  const canonicalUrl = canonical ? absoluteUrl(canonical, baseUrl) : `${baseUrl}${pathname}`;
  const pageTitle = title ? `${title} | ${seoFeatureConfig.defaultTitle}` : seoFeatureConfig.defaultTitle;
  const pageDesc = description ?? seoFeatureConfig.defaultDescription;
  const ogImageUrl = ogImage ? absoluteUrl(ogImage, baseUrl) : seoFeatureConfig.defaultOgImage;

  return (
    <>
      {/* Title */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* OpenGraph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:type" content={seoFeatureConfig.siteType} />
      <meta property="og:site_name" content={seoFeatureConfig.organizationName} />
      <meta property="og:locale" content={seoFeatureConfig.locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:site" content={seoFeatureConfig.twitterHandle} />

      {/* Robots */}
      <meta name="robots" content={indexable ? "index, follow" : "noindex, nofollow"} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <JsonLdScript data={jsonLd} />
      )}
    </>
  );
}

/** Internal helper to render JSON-LD script. */
function JsonLdScript({ data }: { data: IJsonLd | IJsonLd[] }) {
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
