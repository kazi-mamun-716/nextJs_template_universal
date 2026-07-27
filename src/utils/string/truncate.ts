/**
 * String truncation utility.
 */

/**
 * Truncates a string to the specified length, appending ellipsis if needed.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
