/**
 * Array chunk and partition utilities.
 */

/**
 * Splits an array into chunks of the specified size.
 *
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length || size < 1) return [];
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Splits an array into two groups based on a predicate function.
 *
 * @example
 * partition([1, 2, 3, 4], (n) => n % 2 === 0) // [[2, 4], [1, 3]]
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  for (const item of array) {
    if (predicate(item)) pass.push(item);
    else fail.push(item);
  }
  return [pass, fail];
}

/**
 * Splits an array into a fixed number of groups round-robin style.
 *
 * @example
 * interleave([1, 2, 3, 4, 5], 3) // [[1, 4], [2, 5], [3]]
 */
export function interleave<T>(array: T[], groups: number): T[][] {
  const result: T[][] = Array.from({ length: groups }, () => []);
  array.forEach((item, index) => {
    result[index % groups].push(item);
  });
  return result;
}
