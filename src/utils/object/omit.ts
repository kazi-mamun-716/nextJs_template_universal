/**
 * Object omit utilities.
 */

/**
 * Omits specified keys from an object.
 *
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ["b"]) // { a: 1, c: 3 }
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

/**
 * Omits keys from an object using a predicate function.
 */
export function omitBy<T extends Record<string, unknown>>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && !predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omits undefined and null values from an object.
 */
export function omitNil<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return omitBy(obj, (value) => value === undefined || value === null);
}
