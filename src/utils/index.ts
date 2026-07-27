/**
 * Utility functions barrel export.
 *
 * Import from this module to access all utilities:
 * @example import { formatDate, slugify, paginate, hashPassword } from "@/utils";
 */

// ─── Infrastructure ───────────────────────────────────
export { logger } from "./logger";

// ─── Date ─────────────────────────────────────────────
export {
  formatDate,
  formatDateISO,
  formatTime,
  formatDateTime,
  formatDateRange,
  dateDiff,
  isBefore,
  isAfter,
  isBetween,
  isToday,
  isWithinLast,
  startOfDay,
  endOfDay,
  addDays,
  addMonths,
} from "./date/format";
export { timeAgo, timeUntil, getRelativeTime, getShortRelativeTime } from "./date/relative-time";

// ─── String ───────────────────────────────────────────
export { slugify, uniqueSlug, filenameSlug } from "./string/slug";
export { truncate, truncateWords, truncateChars } from "./string/truncate";
export { capitalize, capitalizeWords, uncapitalize, sentenceCase } from "./string/capitalize";
export {
  camelCase,
  pascalCase,
  snakeCase,
  kebabCase,
  constantCase,
  titleCase,
  dotCase,
  pathCase,
} from "./string/case";
export {
  stripHtml,
  normalizeWhitespace,
  escapeHtml,
  compactWhitespace,
  removeWhitespace,
  removeNonAscii,
} from "./string/sanitize";
export {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  isValidHexColor,
  isValidUUID,
  isAlphanumeric,
  isValidJSON,
} from "./string/validation";

// ─── Number ───────────────────────────────────────────
export {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatOrdinal,
  formatCompact,
  formatFixed,
  formatSigned,
  roundTo,
} from "./number/format";
export { clamp, inRange, mapRange, lerp, approximatelyEqual } from "./number/clamp";

// ─── Array ────────────────────────────────────────────
export { first, last, head, tail, pluck, nth, at } from "./array/access";
export { chunk, partition, interleave } from "./array/chunk";
export { groupBy, groupByFn } from "./array/group-by";
export { sample, sampleSize, shuffle, seededShuffle } from "./array/random";
export { sortBy, sortByFn, sortByInPlace, naturalSort } from "./array/sort";
export {
  unique,
  uniqueBy,
  uniqueByFn,
  symmetricDifference,
  intersection,
  difference,
} from "./array/unique";
export { paginate, getPaginationMeta, getPageNumbers, clampPage } from "./pagination";

// ─── Object ───────────────────────────────────────────
export { pick, pickExisting, pickBy } from "./object/pick";
export { omit, omitBy, omitNil } from "./object/omit";
export { mapValues, mapKeys, entries, fromEntries, invert } from "./object/map";
export { deepMerge, cloneDeep, isObject, isEmpty } from "./object/deep-merge";

// ─── Encryption & Tokens ──────────────────────────────
export {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  generateRandomString,
} from "./encryption/index";
export {
  generateToken,
  generateBase64Token,
  generateOTP,
  generateAlphanumericToken,
  hashToken,
  compareTokens,
  createTokenWithExpiry,
  isExpired,
} from "./token/index";

// ─── Formatters ───────────────────────────────────────
export { formatPhone, formatBytes, formatDuration, formatList, maskString } from "./formatter";
