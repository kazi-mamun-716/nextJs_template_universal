/**
 * Array pagination utility.
 */

/**
 * Paginates an array and returns the items for the requested page.
 */
export function paginate<T>(array: T[], page: number, pageSize: number): T[] {
  const startIndex = (page - 1) * pageSize;
  return array.slice(startIndex, startIndex + pageSize);
}
