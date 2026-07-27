/**
 * Pagination utility functions.
 * Pure math functions for computing pagination state.
 */

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  /** Index of the first item on the current page (0-based) */
  startIndex: number;
  /** Index of the last item on the current page (0-based, inclusive) */
  endIndex: number;
  /** Number of items on the current page (may be less than pageSize on last page) */
  itemCount: number;
}

/**
 * Computes full pagination metadata from page, pageSize, and total.
 *
 * @example
 * getPaginationMeta({ page: 2, pageSize: 10, total: 45 })
 * // { page: 2, pageSize: 10, total: 45, totalPages: 5, hasNext: true, hasPrevious: true, startIndex: 10, endIndex: 19, itemCount: 10 }
 */
export function getPaginationMeta(params: {
  page: number;
  pageSize: number;
  total: number;
}): PaginationMeta {
  const { page, pageSize, total } = params;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, total - 1);
  const itemCount = Math.min(pageSize, total - startIndex);

  return {
    page: safePage,
    pageSize,
    total,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrevious: safePage > 1,
    startIndex,
    endIndex,
    itemCount,
  };
}

/**
 * Paginates an array and returns the items for the requested page plus metadata.
 *
 * @example
 * paginate([1,2,3,4,5], { page: 1, pageSize: 2 })
 * // { data: [1,2], meta: { page:1, pageSize:2, total:5, ... } }
 */
export function paginate<T>(
  array: T[],
  params: { page: number; pageSize: number },
): { data: T[]; meta: PaginationMeta } {
  const meta = getPaginationMeta({ ...params, total: array.length });
  const data = array.slice(meta.startIndex, meta.endIndex + 1);
  return { data, meta };
}

/**
 * Generates an array of page numbers to display in a pagination control.
 * Shows first, last, and pages around current with ellipsis markers.
 *
 * @example
 * getPageNumbers({ page: 5, totalPages: 10 }) // [1, "...", 4, 5, 6, "...", 10]
 */
export function getPageNumbers(
  params: { page: number; totalPages: number; siblingCount?: number },
): (number | "...")[] {
  const { page, totalPages, siblingCount = 1 } = params;

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(page - siblingCount, 1);
  const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  const pages: (number | "...")[] = [];

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    for (let i = 1; i <= leftItemCount; i++) pages.push(i);
    pages.push("...");
    pages.push(totalPages);
  } else if (showLeftEllipsis && !showRightEllipsis) {
    pages.push(1);
    pages.push("...");
    for (let i = totalPages - (3 + 2 * siblingCount) + 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push("...");
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) pages.push(i);
    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Clamps a page number to a valid range.
 */
export function clampPage(page: number, totalPages: number): number {
  return Math.max(1, Math.min(page, totalPages));
}
