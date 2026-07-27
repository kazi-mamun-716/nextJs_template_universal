import { appConfig } from "@/config/app";

/**
 * Robots.txt configuration generator.
 */
export const robotsGenerator = {
  generate() {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
      sitemap: `${appConfig.url}/sitemap.xml`,
    };
  },
};
