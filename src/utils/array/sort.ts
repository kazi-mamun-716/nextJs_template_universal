/**
 * Array sorting utilities.
 */

type SortOrder = "asc" | "desc";

/**
 * Sorts an array of objects by a key (returns new array).
 *
 * @example
 * sortBy([{ name: "Bob" }, { name: "Alice" }], "name")
 * // [{ name: "Alice" }, { name: "Bob" }]
 */
export function sortBy<T>(array: T[], key: keyof T, order: SortOrder = "asc"): T[] {
  return [...array].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Sorts an array of objects by a function that derives the sort value.
 *
 * @example
 * sortByFn(["Bob", "Alice"], (s) => s.length) // ["Bob", "Alice"]
 */
export function sortByFn<T>(array: T[], fn: (item: T) => number | string, order: SortOrder = "asc"): T[] {
  return [...array].sort((a, b) => {
    const valA = fn(a);
    const valB = fn(b);
    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Sorts an array in place by a key.
 */
export function sortByInPlace<T>(array: T[], key: keyof T, order: SortOrder = "asc"): T[] {
  return array.sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Natural sort (human-friendly numeric ordering).
 *
 * @example
 * naturalSort(["item2", "item10", "item1"]) // ["item1", "item2", "item10"]
 */
export function naturalSort(array: string[], order: SortOrder = "asc"): string[] {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });
  return [...array].sort((a, b) => {
    const result = collator.compare(a, b);
    return order === "asc" ? result : -result;
  });
}
