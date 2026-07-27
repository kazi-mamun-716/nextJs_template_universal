/**
 * SEO feature type definitions.
 */
export interface ISEOMetadata {
  title: string;
  description: string;
  canonical?: string;
}

export interface IOpenGraph {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: string;
}

export interface ITwitterCard {
  card: "summary" | "summary_large_image";
  title: string;
  description: string;
  image?: string;
}

export interface IJsonLd {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}
