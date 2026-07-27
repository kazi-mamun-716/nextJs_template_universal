/**
 * Common Zod refinements.
 *
 * Reusable `.refine()` and `.superRefine()` logic for cross-cutting validation patterns.
 * Feature schemas can import these instead of redefining common refinements.
 *
 * @example
 * import { z } from "zod";
 * import { passwordsMatch } from "@/lib/validation/refinements";
 *
 * const schema = z.object({
 *   password: z.string(),
 *   confirmPassword: z.string(),
 * }).superRefine(passwordsMatch("password", "confirmPassword"));
 */

import { z } from "zod";
import { MESSAGES } from "@/constants/messages";
import { REGEX } from "@/constants/regex";

// ─── Password Helpers ─────────────────────────────

/**
 * Refinement that checks two password fields match.
 *
 * @param passwordField - Name of the password field (default: "password")
 * @param confirmField - Name of the confirm field (default: "confirmPassword")
 *
 * @example
 * z.object({ password: z.string(), confirmPassword: z.string() })
 *   .superRefine(passwordsMatchRefinement());
 */
export function passwordsMatchRefinement(passwordField = "password", confirmField = "confirmPassword") {
  return (data: Record<string, unknown>, ctx: z.RefinementCtx) => {
    const password = data[passwordField];
    const confirm = data[confirmField];

    if (password && confirm && password !== confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: MESSAGES.VALIDATION.PASSWORD_MISMATCH,
        path: [confirmField],
      });
    }
  };
}

// ─── Date Helpers ─────────────────────────────────

/**
 * Refinement that checks a start date is before an end date.
 *
 * @param startField - Name of the start date field
 * @param endField - Name of the end date field
 * @param message - Custom error message
 *
 * @example
 * z.object({ startDate: z.string(), endDate: z.string() })
 *   .superRefine(dateOrder("startDate", "endDate"));
 */
export function dateOrder(
  startField: string,
  endField: string,
  message = `"${startField}" must be before "${endField}"`,
) {
  return (data: Record<string, unknown>, ctx: z.RefinementCtx) => {
    const start = data[startField];
    const end = data[endField];

    if (start && end && new Date(start as string) >= new Date(end as string)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: [endField],
      });
    }
  };
}

/**
 * Refinement that checks a date is in the past.
 */
export function isPastDate(dateField: string, message = MESSAGES.VALIDATION.PAST_DATE) {
  return (data: Record<string, unknown>, ctx: z.RefinementCtx) => {
    const value = data[dateField];
    if (value && new Date(value as string) > new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: [dateField],
      });
    }
  };
}

/**
 * Refinement that checks a date is in the future.
 */
export function isFutureDate(dateField: string, message = MESSAGES.VALIDATION.FUTURE_DATE) {
  return (data: Record<string, unknown>, ctx: z.RefinementCtx) => {
    const value = data[dateField];
    if (value && new Date(value as string) <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: [dateField],
      });
    }
  };
}

// ─── Conditional Helpers ──────────────────────────

/**
 * Refinement that makes a field required if a condition is met.
 *
 * @param field - The field to validate
 * @param condition - Function that checks if the field should be required
 * @param message - Error message when required
 *
 * @example
 * z.object({ country: z.string(), state: z.string().optional() })
 *   .superRefine(requiredIf("state", (data) => data.country === "US"));
 */
export function requiredIf(
  field: string,
  condition: (data: Record<string, unknown>) => boolean,
  message = MESSAGES.VALIDATION.REQUIRED,
) {
  return (data: Record<string, unknown>, ctx: z.RefinementCtx) => {
    if (condition(data) && !data[field]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: [field],
      });
    }
  };
}

/**
 * Refinement that ensures at least one field in a group is provided.
 *
 * @param fields - Array of field names to check
 * @param message - Error message
 *
 * @example
 * z.object({ email: z.string().optional(), phone: z.string().optional() })
 *   .superRefine(atLeastOne(["email", "phone"]));
 */
export function atLeastOne(
  fields: string[],
  message = `At least one of ${fields.join(", ")} is required`,
) {
  return (data: Record<string, unknown>, ctx: z.RefinementCtx) => {
    const hasValue = fields.some((field) => {
      const value = data[field];
      return value !== undefined && value !== null && value !== "";
    });

    if (!hasValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: [fields[0]],
      });
    }
  };
}

// ─── Array Helpers ─────────────────────────────────

/**
 * Refinement that checks an array has at least one item.
 */
export function nonEmptyArray(arrayField: string, message = "At least one item is required") {
  return (data: Record<string, unknown>, ctx: z.RefinementCtx) => {
    const arr = data[arrayField];
    if (!Array.isArray(arr) || arr.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: [arrayField],
      });
    }
  };
}

// ─── String Helpers ───────────────────────────────

/**
 * Refinement that checks a string field doesn't contain HTML tags.
 */
export function noHtml(field: string, message = "HTML tags are not allowed") {
  return (data: Record<string, unknown>, ctx: z.RefinementCtx) => {
    const value = data[field] as string | undefined;
    if (value && REGEX.HTML_TAG.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: [field],
      });
    }
  };
}
