/**
 * Zod Validation Architecture — Public API
 *
 * Provides reusable validation primitives for the entire application.
 * Feature schemas compose these shared building blocks instead of
 * redefining common patterns.
 *
 * Architecture layers:
 * - `fields` — Reusable field schemas (email, password, name, url, etc.)
 * - `refinements` — Cross-cutting refinement functions (password match, date order, etc.)
 * - `validate/s` — Parse-and-format helpers for server actions and API routes
 *
 * @example
 * import { fields, validate } from "@/lib/validation";
 * import { passwordsMatchRefinement } from "@/lib/validation/refinements";
 *
 * const schema = z.object({
 *   email: fields.email(),
 *   password: fields.password(),
 *   confirmPassword: fields.password(),
 * }).superRefine(passwordsMatchRefinement());
 *
 * const result = validate(schema, rawData);
 */

// Reusable field schemas
export { fields } from "./fields";

// Reusable refinements
export {
  passwordsMatchRefinement,
  dateOrder,
  isPastDate,
  isFutureDate,
  requiredIf,
  atLeastOne,
  nonEmptyArray,
  noHtml,
} from "./refinements";

// Validation utilities
export { validate, validateFormData, withValidation, formatZodError, zodErrorToApiResponse, getFieldError } from "./utils";
export type { ValidationResult, ValidationError, InferInput, InferOutput } from "./utils";
