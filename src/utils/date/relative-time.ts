/**
 * Relative time formatting utilities (e.g., "2 hours ago", "in 3 days").
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

interface RelativeTimeConfig {
  /** Whether to show future dates as "in X" vs "X ago" */
  future?: boolean;
  /** Compact mode: "2h ago" vs "2 hours ago" */
  compact?: boolean;
}

/**
 * Returns a human-readable relative time string for past dates (e.g., "2 hours ago").
 */
export function timeAgo(
  date: Date | string,
  options: RelativeTimeConfig = {},
): string {
  const now = Date.now();
  const past = new Date(date).getTime();
  const diffMs = now - past;

  return formatRelativeTime(diffMs, { ...options, future: false });
}

/**
 * Returns a human-readable relative time string for future dates (e.g., "in 3 days").
 */
export function timeUntil(
  date: Date | string,
  options: RelativeTimeConfig = {},
): string {
  const now = Date.now();
  const future = new Date(date).getTime();
  const diffMs = future - now;

  return formatRelativeTime(diffMs, { ...options, future: true });
}

/**
 * Automatically detects past/future and returns the appropriate string.
 */
export function getRelativeTime(
  date: Date | string,
  options: RelativeTimeConfig = {},
): string {
  const now = Date.now();
  const d = new Date(date).getTime();
  const diffMs = d - now;

  return formatRelativeTime(Math.abs(diffMs), {
    ...options,
    future: diffMs > 0,
  });
}

function formatRelativeTime(
  diffMs: number,
  options: RelativeTimeConfig & { future: boolean },
): string {
  const absDiff = Math.abs(diffMs);
  const prefix = options.future ? "in " : "";
  const suffix = options.future ? "" : " ago";

  if (absDiff < MINUTE) {
    const seconds = Math.floor(absDiff / SECOND);
    if (options.compact) return options.future ? `in ${seconds}s` : `${seconds}s ago`;
    if (seconds < 10) return "just now";
    return `${prefix}${seconds} second${seconds !== 1 ? "s" : ""}${suffix}`;
  }

  if (absDiff < HOUR) {
    const minutes = Math.floor(absDiff / MINUTE);
    if (options.compact) return `${prefix}${minutes}m${suffix}`;
    return `${prefix}${minutes} minute${minutes !== 1 ? "s" : ""}${suffix}`;
  }

  if (absDiff < DAY) {
    const hours = Math.floor(absDiff / HOUR);
    if (options.compact) return `${prefix}${hours}h${suffix}`;
    return `${prefix}${hours} hour${hours !== 1 ? "s" : ""}${suffix}`;
  }

  if (absDiff < WEEK) {
    const days = Math.floor(absDiff / DAY);
    if (options.compact) return `${prefix}${days}d${suffix}`;
    return `${prefix}${days} day${days !== 1 ? "s" : ""}${suffix}`;
  }

  if (absDiff < MONTH) {
    const weeks = Math.floor(absDiff / WEEK);
    if (options.compact) return `${prefix}${weeks}w${suffix}`;
    return `${prefix}${weeks} week${weeks !== 1 ? "s" : ""}${suffix}`;
  }

  if (absDiff < YEAR) {
    const months = Math.floor(absDiff / MONTH);
    if (options.compact) return `${prefix}${months}mo${suffix}`;
    return `${prefix}${months} month${months !== 1 ? "s" : ""}${suffix}`;
  }

  const years = Math.floor(absDiff / YEAR);
  if (options.compact) return `${prefix}${years}y${suffix}`;
  return `${prefix}${years} year${years !== 1 ? "s" : ""}${suffix}`;
}

/**
 * Returns a short relative time (e.g., "2h ago", "3d ago").
 */
export function getShortRelativeTime(date: Date | string): string {
  return getRelativeTime(date, { compact: true });
}
