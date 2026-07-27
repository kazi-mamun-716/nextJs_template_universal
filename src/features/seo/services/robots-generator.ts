/**
 * Robots.txt configuration generator.
 *
 * Generates robots.txt rules that are environment-aware:
 * - Development: blocks all crawlers
 * - Production: allows crawling with sensible disallows
 *
 * @example
 * // In app/robots.ts:
 * import { robotsGenerator } from "@/features/seo";
 *
 * export default function robots() {
 *   return robotsGenerator.generate();
 * }
 */

import { appConfig } from "@/config/app";

export interface RobotsConfig {
  /** Whether to allow indexing (default: true in production). */
  allowIndexing?: boolean;
  /** Additional paths to disallow. */
  extraDisallow?: string[];
  /** Custom allow rules. */
  extraAllow?: string[];
}

export const robotsGenerator = {
  /**
   * Generate Robots object for Next.js robots.ts route.
   *
   * @param options - Override options
   * @returns Robots config object
   */
  generate(options: RobotsConfig = {}) {
    const isProduction = process.env.NODE_ENV === "production";
    const allowIndexing = options.allowIndexing ?? isProduction;

    // In development / staging, block all crawlers
    if (!allowIndexing) {
      return {
        rules: {
          userAgent: "*",
          disallow: "/",
        },
      };
    }

    // Production rules
    const disallow = [
      "/api/",
      "/dashboard/",
      "/_next/",
      "/admin/",
      ...(options.extraDisallow ?? []),
    ];

    const allow = [...(options.extraAllow ?? [])];

    return {
      rules: {
        userAgent: "*",
        allow: allow.length > 0 ? allow : undefined,
        disallow,
      },
      sitemap: `${appConfig.url}/sitemap.xml`,
    };
  },
};
