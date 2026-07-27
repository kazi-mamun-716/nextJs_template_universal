import type { MetadataRoute } from "next";
import { robotsGenerator } from "@/features/seo";

/**
 * Generate robots.txt for search engine crawlers.
 *
 * Blocks crawling in development and restricts sensitive paths
 * in production (API, dashboard, admin).
 */
export default function robots(): MetadataRoute.Robots {
  return robotsGenerator.generate();
}
