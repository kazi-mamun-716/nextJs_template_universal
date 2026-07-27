import type { MetadataRoute } from "next";
import { sitemapGenerator } from "@/features/seo";

/**
 * Generate sitemap.xml for search engines.
 *
 * Combines static pages with any future dynamic content.
 * To add dynamic content (e.g. blog posts from a CMS):
 *
 * @example
 * export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 *   const posts = await getPosts();
 *   return sitemapGenerator.generate({
 *     async getArticles() {
 *       return posts.map(p => ({ url: `/blog/${p.slug}`, lastModified: p.updatedAt }));
 *     },
 *   });
 * }
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = sitemapGenerator.generateStatic();

  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified ? new Date(entry.lastModified) : new Date(),
    changeFrequency: entry.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: entry.priority,
  }));
}
