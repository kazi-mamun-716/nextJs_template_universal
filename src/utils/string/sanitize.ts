/**
 * String sanitization utilities.
 */

/**
 * Strips HTML tags from a string.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Trims and normalizes whitespace in a string.
 */
export function normalizeWhitespace(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}
