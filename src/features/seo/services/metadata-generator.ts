/**
 * Metadata generator — factory for creating Next.js Metadata objects.
 *
 * Provides a consistent API for generating page metadata with default
 * OpenGraph, Twitter Card, and canonical URL handling.
 *
 * @example
 * // In a page:
 * export const metadata = metadataGenerator.page("About", "Learn about us");
 *
 * // With full customisation:
 * export const metadata = metadataGenerator.page("Pricing", "Our plans", {
 *   openGraph: { image: "/custom-og.png" },
 *   robots: { index: false },
 * });
 */

import type { Metadata } from "next";
import { seoFeatureConfig } from "../config";
import type { IOpenGraph, ITwitterCard } from "../types";

type MetadataImage = NonNullable<Metadata["openGraph"]>["images"];

// ─── Helpers ─────────────────────────────────────────

function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${seoFeatureConfig.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function resolveImages(images?: string | string[] | null): MetadataImage {
  if (!images) return undefined;
  const arr = Array.isArray(images) ? images : [images];
  return arr.map((img) => ({ url: absoluteUrl(img) }));
}

// ─── Metadata Generator ─────────────────────────────

export const metadataGenerator = {
  /**
   * Default site-wide metadata (used in root layout).
   */
  default(): Metadata {
    return {
      title: {
        default: seoFeatureConfig.defaultTitle,
        template: seoFeatureConfig.titleTemplate,
      },
      description: seoFeatureConfig.defaultDescription,
      metadataBase: new URL(seoFeatureConfig.baseUrl),
      openGraph: {
        title: seoFeatureConfig.defaultTitle,
        description: seoFeatureConfig.defaultDescription,
        url: seoFeatureConfig.baseUrl,
        siteName: seoFeatureConfig.organizationName,
        locale: seoFeatureConfig.locale,
        type: seoFeatureConfig.siteType as "website" | "article" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other",
        images: resolveImages(seoFeatureConfig.defaultOgImage),
      },
      twitter: {
        card: "summary_large_image",
        title: seoFeatureConfig.defaultTitle,
        description: seoFeatureConfig.defaultDescription,
        site: seoFeatureConfig.twitterHandle,
        images: resolveImages(seoFeatureConfig.defaultTwitterImage),
      },
      robots: {
        index: seoFeatureConfig.robots.index,
        follow: seoFeatureConfig.robots.follow,
      },
    };
  },

  /**
   * Page-specific metadata with defaults inheritance.
   */
  page(
    title: string,
    description: string,
    overrides?: {
      canonical?: string;
      openGraph?: Partial<IOpenGraph>;
      twitter?: Partial<ITwitterCard>;
      robots?: Partial<{ index: boolean; follow: boolean }>;
      image?: string;
      jsonLd?: Record<string, unknown> | Record<string, unknown>[];
    },
  ): Metadata {
    const pageUrl = overrides?.canonical
      ? absoluteUrl(overrides.canonical)
      : undefined;

    const ogImage = overrides?.image ?? overrides?.openGraph?.image ?? seoFeatureConfig.defaultOgImage;
    const twitterImage = overrides?.image ?? overrides?.twitter?.image ?? seoFeatureConfig.defaultTwitterImage;

    return {
      title,
      description,
      ...(pageUrl && {
        alternates: { canonical: pageUrl },
      }),
      openGraph: {
        title: `${title} | ${seoFeatureConfig.defaultTitle}`,
        description,
        ...(pageUrl && { url: pageUrl }),
        images: resolveImages(ogImage),
        type: (overrides?.openGraph?.type ?? seoFeatureConfig.siteType) as "website" | "article" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | ${seoFeatureConfig.defaultTitle}`,
        description,
        images: resolveImages(twitterImage),
        site: seoFeatureConfig.twitterHandle,
      },
      robots: overrides?.robots ?? {
        index: seoFeatureConfig.robots.index,
        follow: seoFeatureConfig.robots.follow,
      },
    };
  },

  /**
   * Layout-level metadata (for dashboard sections etc.).
   */
  layout(title: string, description?: string): Metadata {
    return {
      title,
      ...(description && { description }),
    };
  },

  /**
   * Build an OpenGraph object for custom usage.
   */
  buildOpenGraph(overrides: Partial<IOpenGraph>): Metadata["openGraph"] {
    return {
      title: overrides.title ?? seoFeatureConfig.defaultTitle,
      description: overrides.description ?? seoFeatureConfig.defaultDescription,
      url: overrides.url ?? seoFeatureConfig.baseUrl,
      siteName: overrides.siteName ?? seoFeatureConfig.organizationName,
      locale: overrides.locale ?? seoFeatureConfig.locale,
      type: (overrides.type ?? seoFeatureConfig.siteType) as "website" | "article" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other",
      images: overrides.image ? resolveImages(overrides.image) : resolveImages(seoFeatureConfig.defaultOgImage),
    };
  },

  /**
   * Build a Twitter Card object for custom usage.
   */
  buildTwitterCard(overrides: Partial<ITwitterCard>): Metadata["twitter"] {
    return {
      card: overrides.card ?? "summary_large_image",
      title: overrides.title ?? seoFeatureConfig.defaultTitle,
      description: overrides.description ?? seoFeatureConfig.defaultDescription,
      site: overrides.site ?? seoFeatureConfig.twitterHandle,
      images: overrides.image ? resolveImages(overrides.image) : resolveImages(seoFeatureConfig.defaultTwitterImage),
    };
  },

  /**
   * Generate a canonical URL helper.
   */
  canonical(path: string): string {
    return absoluteUrl(path);
  },
};
