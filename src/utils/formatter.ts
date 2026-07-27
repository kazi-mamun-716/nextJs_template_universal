/**
 * Formatter utilities for common data formatting patterns.
 */

/**
 * Formats a phone number into a readable format.
 * Supports US and international formats.
 *
 * @example
 * formatPhone("1234567890") // "(123) 456-7890"
 * formatPhone("+14151234567") // "+1 (415) 123-4567"
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  // US number (10 digits)
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // US number with country code (11 digits, starts with 1)
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // International - format with plus
  return `+${digits}`;
}

/**
 * Formats bytes into a human-readable file size string.
 *
 * @example
 * formatBytes(1024) // "1 KB"
 * formatBytes(1536) // "1.5 KB"
 * formatBytes(1048576) // "1 MB"
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);

  if (i === 0) return `${value} ${sizes[i]}`;
  return `${value.toFixed(decimals)} ${sizes[i]}`;
}

/**
 * Formats milliseconds into a human-readable duration string.
 *
 * @example
 * formatDuration(90000) // "1m 30s"
 * formatDuration(3661000) // "1h 1m 1s"
 */
export function formatDuration(ms: number): string {
  if (ms < 0) return `-${formatDuration(-ms)}`;
  if (ms < 1000) return `${ms}ms`;

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours % 24 > 0) parts.push(`${hours % 24}h`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
  if (seconds % 60 > 0) parts.push(`${seconds % 60}s`);

  return parts.join(" ") || "0s";
}

/**
 * Formats a list of items with proper conjunctions.
 *
 * @example
 * formatList(["A"]) // "A"
 * formatList(["A", "B"]) // "A and B"
 * formatList(["A", "B", "C"]) // "A, B, and C"
 */
export function formatList(items: string[], conjunction = "and"): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, ${conjunction} ${items[items.length - 1]}`;
}

/**
 * Masks a string, showing only the first and last few characters.
 *
 * @example
 * maskString("hello@example.com") // "hel***@***om"
 * maskString("1234567890", { visibleStart: 2, visibleEnd: 2 }) // "12******90"
 */
export function maskString(
  text: string,
  options?: { visibleStart?: number; visibleEnd?: number; maskChar?: string },
): string {
  const { visibleStart = 3, visibleEnd = 3, maskChar = "*" } = options ?? {};

  if (text.length <= visibleStart + visibleEnd) {
    return text.slice(0, visibleStart) + maskChar.repeat(Math.max(1, text.length - visibleStart));
  }

  return text.slice(0, visibleStart) + maskChar.repeat(text.length - visibleStart - visibleEnd) + text.slice(-visibleEnd);
}

/**
 * Formats a number with thousands separators (alias for Intl-based formatting).
 *
 * @example
 * formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(num: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Formats a number as ordinal (1st, 2nd, 3rd, 4th, etc.).
 *
 * @example
 * formatOrdinal(1) // "1st"
 * formatOrdinal(23) // "23rd"
 */
export function formatOrdinal(num: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = num % 100;
  const suffix = v >= 11 && v <= 13 ? "th" : suffixes[Math.min(v % 10, 4)] ?? "th";
  return `${num}${suffix}`;
}

/**
 * Formats a number as a percentage string.
 *
 * @example
 * formatPercent(0.1234) // "12.3%"
 * formatPercent(0.1234, 0) // "12%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formats a number as currency with Intl support.
 *
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(99.99, "EUR", "de-DE") // "99,99 €"
 */
export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
