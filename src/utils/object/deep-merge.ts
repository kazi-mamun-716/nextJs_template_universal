/**
 * Deep merge and clone utilities.
 */

/**
 * Deeply merges two or more objects.
 * Later objects take precedence over earlier ones.
 * Arrays are concatenated by default.
 *
 * @example
 * deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 } })
 * // { a: 1, b: { c: 2, d: 3 } }
 */
export function deepMerge<T extends Record<string, unknown>>(...objects: T[]): T {
  const result = { ...objects[0] } as Record<string, unknown>;

  for (let i = 1; i < objects.length; i++) {
    const obj = objects[i] as Record<string, unknown>;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const existing = result[key];

        if (Array.isArray(value) && Array.isArray(existing)) {
          // Concatenate arrays
          result[key] = [...existing, ...value];
        } else if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          existing &&
          typeof existing === "object" &&
          !Array.isArray(existing)
        ) {
          // Deep merge objects
          result[key] = deepMerge(existing as Record<string, unknown>, value as Record<string, unknown>);
        } else {
          result[key] = value;
        }
      }
    }
  }

  return result as T;
}

/**
 * Creates a deep clone of an object.
 */
export function cloneDeep<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(cloneDeep) as unknown as T;
  const cloned = {} as Record<string, unknown>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = cloneDeep((obj as Record<string, unknown>)[key]);
    }
  }
  return cloned as T;
}

/**
 * Checks if a value is an object (not null, not array).
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Checks if a value is empty (empty object, empty array, null, undefined, empty string).
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}
