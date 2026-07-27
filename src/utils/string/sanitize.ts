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

/**
 * Removes all non-ASCII characters.
 */
export function removeNonAscii(text: string): string {
  return text.replace(/[^\x20-\x7E]/g, "");
}

/**
 * Escapes HTML special characters to prevent XSS.
 */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] ?? char);
}

/**
 * Removes extra whitespace (multiple spaces, tabs, newlines) and trims.
 */
export function compactWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Removes all whitespace from a string.
 */
export function removeWhitespace(text: string): string {
  return text.replace(/\s/g, "");
}
