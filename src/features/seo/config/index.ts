import { appConfig } from "@/config/app";

/**
 * SEO feature configuration.
 */
export const seoFeatureConfig = {
  defaultTitle: appConfig.name,
  defaultDescription: appConfig.description,
  defaultOgImage: `${appConfig.url}/og-image.png`,
  twitterHandle: "@yourhandle",
  locale: "en_US",
  siteType: "website",
} as const;
