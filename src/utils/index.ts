/**
 * Utility functions barrel export.
 */
export { successResponse, errorResponse, paginatedResponse } from "./response";
export {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  InternalError,
} from "./errors";
export { logger } from "./logger";

// Date utilities
export { formatDate, formatDateISO } from "./date/format";
export { getRelativeTime } from "./date/relative-time";

// String utilities
export { slugify } from "./string/slug";
export { truncate } from "./string/truncate";
export { capitalize, capitalizeWords } from "./string/capitalize";
export { stripHtml, normalizeWhitespace } from "./string/sanitize";

// Number utilities
export { formatNumber, formatCurrency } from "./number/format";
export { clamp } from "./number/clamp";

// Array utilities
export { groupBy } from "./array/group-by";
export { unique, uniqueBy } from "./array/unique";
export { paginate } from "./array/paginate";

// Object utilities
export { pick } from "./object/pick";
export { omit } from "./object/omit";
export { deepMerge } from "./object/deep-merge";

// Encryption & Token utilities
export { hashPassword, comparePassword } from "./encryption/index";
export { generateToken, generateOTP } from "./token/index";
