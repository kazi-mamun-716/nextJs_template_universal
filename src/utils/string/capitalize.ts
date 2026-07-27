/**
 * String capitalization utilities.
 */

/**
 * Capitalizes the first letter of the string.
 *
 * @example
 * capitalize("hello world") // "Hello world"
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitalizes the first letter of each word.
 *
 * @example
 * capitalizeWords("hello world") // "Hello World"
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Uncaps the first letter of the string.
 *
 * @example
 * uncapitalize("Hello world") // "hello world"
 */
export function uncapitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/**
 * Converts a string to sentence case (first letter of first word capitalized).
 *
 * @example
 * sentenceCase("hello WORLD. foo BAR.") // "Hello world. Foo bar."
 */
export function sentenceCase(text: string): string {
  return capitalize(text.toLowerCase().replace(/\.\s+\w/g, (match) => match.toUpperCase()));
}
