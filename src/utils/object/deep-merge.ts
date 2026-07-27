/**
 * Deep merge utility.
 */

/**
 * Deeply merges two or more objects.
 * Later objects take precedence over earlier ones.
 */
export function deepMerge<T extends Record<string, unknown>>(...objects: T[]): T {
  const result = { ...objects[0] } as T;

  for (let i = 1; i < objects.length; i++) {
    const obj = objects[i];
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const existing = result[key];
        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          existing &&
          typeof existing === "object" &&
          !Array.isArray(existing)
        ) {
          (result as Record<string, unknown>)[key] = deepMerge(
            existing as Record<string, unknown>,
            value as Record<string, unknown>,
          );
        } else {
          (result as Record<string, unknown>)[key] = value;
        }
      }
    }
  }

  return result;
}
