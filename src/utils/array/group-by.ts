/**
 * Array grouping utilities.
 */

/**
 * Groups an array of objects by a key.
 *
 * @example
 * groupBy([{ type: "a" }, { type: "b" }, { type: "a" }], "type")
 * // { a: [{ type: "a" }, { type: "a" }], b: [{ type: "b" }] }
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) result[groupKey] = [];
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
}

/**
 * Groups an array by a function that derives the key.
 *
 * @example
 * groupByFn([1, 2, 3, 4], (n) => n % 2 === 0 ? "even" : "odd")
 * // { odd: [1, 3], even: [2, 4] }
 */
export function groupByFn<T>(array: T[], fn: (item: T) => string): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const key = fn(item);
      if (!result[key]) result[key] = [];
      result[key].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
}
