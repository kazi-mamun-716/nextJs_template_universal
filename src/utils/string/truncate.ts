/**
 * String truncation utilities.
 */

interface TruncateOptions {
  /** Maximum length of the resulting string */
  maxLength: number;
  /** String to append when truncated (default: "...") */
  ellipsis?: string;
  /** Whether to truncate at word boundaries (default: false) */
  wordBoundary?: boolean;
  /** Position to truncate: "end" (default) or "middle" */
  position?: "end" | "middle";
}

/**
 * Truncates a string to the specified length.
 *
 * @example
 * truncate("Hello world", { maxLength: 8 }) // "Hello..."
 * truncate("Hello world", { maxLength: 8, wordBoundary: true }) // "Hello..."
 * truncate("Hello world", { maxLength: 8, position: "middle" }) // "Hel...rld"
 */
export function truncate(text: string, options: TruncateOptions): string {
  const { maxLength, ellipsis = "...", wordBoundary = false, position = "end" } = options;

  if (text.length <= maxLength) return text;

  if (position === "middle") {
    const charsToShow = maxLength - ellipsis.length;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return text.slice(0, frontChars) + ellipsis + text.slice(-backChars);
  }

  // End truncation
  let truncated = text.slice(0, maxLength - ellipsis.length);

  if (wordBoundary) {
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 0) truncated = truncated.slice(0, lastSpace);
  }

  return truncated.trimEnd() + ellipsis;
}

/**
 * Truncates a string at a word boundary (preserves whole words).
 *
 * @example
 * truncateWords("Hello beautiful world", 3) // "Hello beautiful..."
 */
export function truncateWords(text: string, wordCount: number, ellipsis = "..."): string {
  const words = text.split(/\s+/);
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(" ") + ellipsis;
}

/**
 * Truncates by number of characters (simple version with defaults).
 *
 * @example
 * truncateChars("Hello world", 5) // "He..."
 */
export function truncateChars(text: string, maxLength: number, ellipsis = "..."): string {
  return truncate(text, { maxLength, ellipsis });
}
