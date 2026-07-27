/**
 * Array uniqueness utilities.
 */

/**
 * Removes duplicate values from an array.
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Removes duplicate objects from an array based on a key.
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const keyValue = item[key];
    if (seen.has(keyValue)) return false;
    seen.add(keyValue);
    return true;
  });
}
