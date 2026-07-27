/**
 * Date formatting utility functions.
 */

/**
 * Formats a date to a human-readable string.
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", options ?? { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Formats a date to ISO string (YYYY-MM-DD).
 */
export function formatDateISO(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}
