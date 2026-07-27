/**
 * Pagination configuration defaults.
 *
 * Controls pagination behavior across all list views.
 * Override per-feature in the feature's own config if needed.
 */
export const paginationConfig = {
  /** Default number of items per page */
  defaultPageSize: 10,
  /** Maximum allowed items per page (safety limit) */
  maxPageSize: 100,
  /** Default page number when none specified */
  defaultPage: 1,
} as const;

export type PaginationConfig = typeof paginationConfig;
