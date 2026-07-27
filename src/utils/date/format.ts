/**
 * Date formatting utilities.
 * All functions are pure and accept both Date objects and ISO strings.
 */

type DateInput = Date | string | number;

function toDate(input: DateInput): Date {
  if (input instanceof Date) return input;
  return new Date(input);
}

/**
 * Formats a date to a human-readable string (e.g., "January 15, 2024").
 */
export function formatDate(
  date: DateInput,
  options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" },
  locale = "en-US",
): string {
  return toDate(date).toLocaleDateString(locale, options);
}

/**
 * Formats a date to ISO string (YYYY-MM-DD).
 */
export function formatDateISO(date: DateInput): string {
  return toDate(date).toISOString().split("T")[0];
}

/**
 * Formats a time to a human-readable string (e.g., "2:30 PM").
 */
export function formatTime(
  date: DateInput,
  options: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" },
  locale = "en-US",
): string {
  return toDate(date).toLocaleTimeString(locale, options);
}

/**
 * Formats a date and time together (e.g., "Jan 15, 2024, 2:30 PM").
 */
export function formatDateTime(
  date: DateInput,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  },
  locale = "en-US",
): string {
  return toDate(date).toLocaleString(locale, options);
}

/**
 * Formats a date range as a readable string (e.g., "Jan 15 – Jan 20, 2024").
 */
export function formatDateRange(
  start: DateInput,
  end: DateInput,
  locale = "en-US",
): string {
  const d1 = toDate(start);
  const d2 = toDate(end);
  const sameYear = d1.getFullYear() === d2.getFullYear();
  const sameMonth = sameYear && d1.getMonth() === d2.getMonth();

  if (sameYear && sameMonth) {
    return `${d1.toLocaleDateString(locale, { month: "short", day: "numeric" })} – ${d2.toLocaleDateString(locale, { day: "numeric", year: "numeric" })}`;
  }
  if (sameYear) {
    return `${d1.toLocaleDateString(locale, { month: "short", day: "numeric" })} – ${d2.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })}`;
  }
  return `${formatDate(d1)} – ${formatDate(d2)}`;
}

/**
 * Calculates the difference between two dates in a given unit.
 */
export function dateDiff(
  date1: DateInput,
  date2: DateInput,
  unit: "ms" | "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years" = "days",
): number {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  const diffMs = d2.getTime() - d1.getTime();

  switch (unit) {
    case "ms": return diffMs;
    case "seconds": return diffMs / 1000;
    case "minutes": return diffMs / (1000 * 60);
    case "hours": return diffMs / (1000 * 60 * 60);
    case "days": return diffMs / (1000 * 60 * 60 * 24);
    case "weeks": return diffMs / (1000 * 60 * 60 * 24 * 7);
    case "months": return (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth();
    case "years": return d2.getFullYear() - d1.getFullYear();
  }
}

/**
 * Checks if a date is before another date.
 */
export function isBefore(date: DateInput, compareTo: DateInput): boolean {
  return toDate(date).getTime() < toDate(compareTo).getTime();
}

/**
 * Checks if a date is after another date.
 */
export function isAfter(date: DateInput, compareTo: DateInput): boolean {
  return toDate(date).getTime() > toDate(compareTo).getTime();
}

/**
 * Checks if a date is between two dates (inclusive).
 */
export function isBetween(date: DateInput, start: DateInput, end: DateInput): boolean {
  const d = toDate(date).getTime();
  return d >= toDate(start).getTime() && d <= toDate(end).getTime();
}

/**
 * Checks if a date is today.
 */
export function isToday(date: DateInput): boolean {
  const d = toDate(date);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/**
 * Checks if a date is within the last N days.
 */
export function isWithinLast(date: DateInput, days: number): boolean {
  const d = toDate(date).getTime();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return d >= cutoff;
}

/**
 * Returns the start of a given day (midnight).
 */
export function startOfDay(date: DateInput): Date {
  const d = toDate(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns the end of a given day (23:59:59.999).
 */
export function endOfDay(date: DateInput): Date {
  const d = toDate(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Adds a specified duration to a date.
 */
export function addDays(date: DateInput, days: number): Date {
  const d = toDate(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Adds months to a date.
 */
export function addMonths(date: DateInput, months: number): Date {
  const d = toDate(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
