/**
 * Object transformation utilities.
 */

/**
 * Maps the values of an object using a transform function.
 *
 * @example
 * mapValues({ a: 1, b: 2 }, (v) => v * 2) // { a: 2, b: 4 }
 */
export function mapValues<T extends Record<string, unknown>, R>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => R,
): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = fn(obj[key], key);
    }
  }
  return result;
}

/**
 * Maps the keys of an object using a transform function.
 *
 * @example
 * mapKeys({ a: 1, b: 2 }, (k) => k.toUpperCase()) // { A: 1, B: 2 }
 */
export function mapKeys<T extends Record<string, unknown>>(
  obj: T,
  fn: (key: keyof T, value: T[keyof T]) => string,
): Record<string, T[keyof T]> {
  const result: Record<string, T[keyof T]> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[fn(key, obj[key])] = obj[key];
    }
  }
  return result;
}

/**
 * Converts an object to an array of key-value pairs.
 */
export function entries<T extends Record<string, unknown>>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

/**
 * Creates an object from an array of key-value pairs.
 */
export function fromEntries<T>(pairs: [string, T][]): Record<string, T> {
  return Object.fromEntries(pairs);
}

/**
 * Inverts an object's keys and values.
 *
 * @example
 * invert({ a: "x", b: "y" }) // { x: "a", y: "b" }
 */
export function invert<T extends Record<string, string | number>>(
  obj: T,
): Record<T[keyof T], keyof T> {
  const result = {} as Record<T[keyof T], keyof T>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[obj[key] as T[keyof T]] = key;
    }
  }
  return result;
}
