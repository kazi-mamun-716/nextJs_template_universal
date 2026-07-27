/**
 * Array access utilities.
 */

/**
 * Returns the first element of an array.
 */
export function first<T>(array: T[]): T | undefined {
  return array[0];
}

/**
 * Returns the last element of an array.
 */
export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}

/**
 * Returns all elements except the last one.
 */
export function head<T>(array: T[]): T[] {
  return array.slice(0, -1);
}

/**
 * Returns all elements except the first one.
 */
export function tail<T>(array: T[]): T[] {
  return array.slice(1);
}

/**
 * Plucks a key from each object in an array.
 *
 * @example
 * pluck([{ id: 1 }, { id: 2 }], "id") // [1, 2]
 */
export function pluck<T, K extends keyof T>(array: T[], key: K): T[K][] {
  return array.map((item) => item[key]);
}

/**
 * Returns the nth element of an array (supports negative indexing).
 */
export function nth<T>(array: T[], index: number): T | undefined {
  return index >= 0 ? array[index] : array[array.length + index];
}

/**
 * Returns the element at the specified index (null-safe).
 */
export function at<T>(array: T[], index: number): T | undefined {
  const safeIndex = index >= 0 ? index : array.length + index;
  return safeIndex >= 0 && safeIndex < array.length ? array[safeIndex] : undefined;
}
