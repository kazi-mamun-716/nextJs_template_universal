import type { Metadata } from "next";
import { appConfig } from "@/config/app";

/**
 * Reusable metadata factory for generating Next.js Metadata objects.
 * Provides consistent OpenGraph, Twitter Card, and canonical URLs.
 */
export const metadataGenerator = {
  default(): Metadata {
    return {
      title: appConfig.name,
      description: appConfig.description,
      metadataBase: new URL(appConfig.url),
    };
  },

  page(title: string, description: string): Metadata {
    return {
      title,
      description,
      openGraph: {
        title: `${title} | ${appConfig.name}`,
        description,
      },
    };
  },
};
