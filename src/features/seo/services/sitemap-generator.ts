/**
 * Sitemap generator — creates sitemap entries for static and dynamic routes.
 *
 * Combines predefined static pages with dynamic database content
 * to produce a complete list of sitemap entries.
 *
 * @example
 * // Generate default sitemap
 * const entries = await sitemapGenerator.generate();
 *
 * // With dynamic content
 * const entries = await sitemapGenerator.generate({
 *   async getArticles() {
 *     return articles.map(a => ({ url: `/blog/${a.slug}`, lastModified: a.updatedAt }));
 *   },
 * });
 */

import { seoFeatureConfig } from "../config";
import { STATIC_PAGES } from "../constants";
import type { ISitemapEntry } from "../types";

export interface SitemapSource {
  /** Fetch dynamic articles/blog posts. */
  getArticles?: () => Promise<Pick<ISitemapEntry, "url" | "lastModified">[]>;
  /** Fetch dynamic user pages. */
  getUsers?: () => Promise<Pick<ISitemapEntry, "url" | "lastModified">[]>;
  /** Fetch dynamic category pages. */
  getCategories?: () => Promise<Pick<ISitemapEntry, "url" | "lastModified">[]>;
  /** Custom dynamic source. */
  getCustom?: () => Promise<ISitemapEntry[]>;
}

export const sitemapGenerator = {
  /**
   * Generate all sitemap entries.
   *
   * @param sources - Optional dynamic data sources
   * @returns Combined array of all sitemap entries
   */
  async generate(sources?: SitemapSource): Promise<ISitemapEntry[]> {
    const entries: ISitemapEntry[] = [];

    // 1. Static pages with predefined priorities
    for (const page of STATIC_PAGES) {
      entries.push({
        url: `${seoFeatureConfig.baseUrl}${page.url}`,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        lastModified: new Date().toISOString(),
      });
    }

    // 2. Dynamic articles / blog posts
    if (sources?.getArticles) {
      const articles = await sources.getArticles();
      for (const article of articles) {
        entries.push({
          url: `${seoFeatureConfig.baseUrl}${article.url}`,
          changeFrequency: "monthly",
          priority: 0.6,
          lastModified: article.lastModified,
        });
      }
    }

    // 3. Dynamic user pages
    if (sources?.getUsers) {
      const users = await sources.getUsers();
      for (const user of users) {
        entries.push({
          url: `${seoFeatureConfig.baseUrl}${user.url}`,
          changeFrequency: "weekly",
          priority: 0.3,
          lastModified: user.lastModified,
        });
      }
    }

    // 4. Dynamic category pages
    if (sources?.getCategories) {
      const categories = await sources.getCategories();
      for (const category of categories) {
        entries.push({
          url: `${seoFeatureConfig.baseUrl}${category.url}`,
          changeFrequency: "weekly",
          priority: 0.5,
          lastModified: category.lastModified,
        });
      }
    }

    // 5. Custom dynamic content
    if (sources?.getCustom) {
      const custom = await sources.getCustom();
      for (const entry of custom) {
        entries.push({
          ...entry,
          url: entry.url.startsWith("http")
            ? entry.url
            : `${seoFeatureConfig.baseUrl}${entry.url}`,
        });
      }
    }

    return entries;
  },

  /**
   * Generate just the static page entries (no async sources needed).
   */
  generateStatic(): ISitemapEntry[] {
    return STATIC_PAGES.map((page) => ({
      url: `${seoFeatureConfig.baseUrl}${page.url}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      lastModified: new Date().toISOString(),
    }));
  },
};
