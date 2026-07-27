/**
 * Blog feature configuration.
 */
export const blogFeatureConfig = {
  /** Default page size for post listings. */
  defaultPageSize: 10,
  /** Maximum page size. */
  maxPageSize: 50,
  /** Whether to auto-generate excerpt from content on creation. */
  autoGenerateExcerpt: true,
  /** Max excerpt length when auto-generated. */
  autoExcerptLength: 160,
} as const;
