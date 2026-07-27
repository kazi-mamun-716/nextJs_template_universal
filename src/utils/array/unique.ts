/**
 * Array uniqueness utilities.
 */

/**
 * Removes duplicate values from an array (primitive values).
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

/**
 * Removes duplicate objects from an array based on a function.
 *
 * @example
 * uniqueByFn([1.1, 1.2, 2.1], Math.floor) // [1.1, 2.1]
 */
export function uniqueByFn<T>(array: T[], fn: (item: T) => unknown): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = fn(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Returns elements that are unique to each array (symmetric difference).
 */
export function symmetricDifference<T>(array1: T[], array2: T[]): T[] {
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  return [...array1.filter((x) => !set2.has(x)), ...array2.filter((x) => !set1.has(x))];
}

/**
 * Returns the intersection of two arrays.
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter((x) => set2.has(x));
}

/**
 * Returns the difference of two arrays (elements in array1 but not in array2).
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter((x) => !set2.has(x));
}
