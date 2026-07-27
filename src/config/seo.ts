import { appConfig } from "@/config/app";

/**
 * SEO configuration defaults.
 */
export const seoConfig = {
  defaultTitle: appConfig.name,
  defaultDescription: appConfig.description,
  defaultOgImage: `${appConfig.url}/og-image.png`,
  twitterHandle: "@yourhandle",
  locale: "en_US",
  siteType: "website" as const,
} as const;
