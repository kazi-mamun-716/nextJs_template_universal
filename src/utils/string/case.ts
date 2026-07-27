/**
 * String case conversion utilities.
 */

/**
 * Splits a string into words regardless of input format.
 */
function splitWords(text: string): string[] {
  // Handle camelCase (split on uppercase boundaries)
  const withSpaces = text.replace(/([A-Z])/g, " $1");
  // Split on non-alpha separators and filter empty
  return withSpaces.split(/[\s_-]+/).filter(Boolean);
}

/**
 * Converts to camelCase.
 */
export function camelCase(text: string): string {
  const words = splitWords(text);
  if (words.length === 0) return "";
  const [first, ...rest] = words;
  return first.toLowerCase() + rest.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

/**
 * Converts to PascalCase.
 */
export function pascalCase(text: string): string {
  return splitWords(text)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

/**
 * Converts to snake_case.
 */
export function snakeCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join("_");
}

/**
 * Converts to kebab-case.
 */
export function kebabCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join("-");
}

/**
 * Converts to CONSTANT_CASE.
 */
export function constantCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toUpperCase())
    .join("_");
}

/**
 * Converts to Title Case.
 */
export function titleCase(text: string): string {
  const minorWords = new Set([
    "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "by", "with", "of", "in",
  ]);
  return splitWords(text)
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (i > 0 && minorWords.has(lower)) return lower;
      return w.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

/**
 * Converts to dot.case.
 */
export function dotCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join(".");
}

/**
 * Converts to path/case.
 */
export function pathCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join("/");
}
