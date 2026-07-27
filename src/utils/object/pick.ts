/**
 * Object pick utilities.
 */

/**
 * Picks specified keys from an object.
 *
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ["a", "c"]) // { a: 1, c: 3 }
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }
  return result;
}

/**
 * Picks specified keys from an object, returning only non-undefined values.
 *
 * @example
 * pickExisting({ a: 1, b: undefined, c: 3 }, ["a", "b"]) // { a: 1 }
 */
export function pickExisting<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Partial<Pick<T, K>> {
  const result: Partial<Pick<T, K>> = {};
  for (const key of keys) {
    if (obj[key] !== undefined) result[key] = obj[key];
  }
  return result;
}

/**
 * Picks keys from an object using a predicate function.
 */
export function pickBy<T extends Record<string, unknown>>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
