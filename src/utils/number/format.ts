/**
 * Number formatting utilities.
 */

/**
 * Formats a number with commas as thousand separators.
 */
export function formatNumber(num: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Formats a number as currency.
 */
export function formatCurrency(amount: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Formats a number as a percentage.
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formats a number with ordinal suffix (1st, 2nd, 3rd, etc.).
 */
export function formatOrdinal(num: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = num % 100;
  if (v >= 11 && v <= 13) return `${num}th`;
  const suffix = suffixes[Math.min(v % 10, 4)] ?? "th";
  return `${num}${suffix}`;
}

/**
 * Formats a number to a compact representation (e.g., 1.5K, 2.3M).
 */
export function formatCompact(num: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
  }).format(num);
}

/**
 * Formats a number to a fixed number of decimal places.
 */
export function formatFixed(num: number, decimals = 2): string {
  return num.toFixed(decimals);
}

/**
 * Formats a number with sign prefix (+ or -).
 */
export function formatSigned(num: number): string {
  if (num > 0) return `+${num}`;
  if (num === 0) return "0";
  return `${num}`;
}

/**
 * Rounds a number to a specified precision.
 */
export function roundTo(num: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}
