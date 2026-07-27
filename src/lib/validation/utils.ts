/**
 * Validation utilities.
 *
 * Provides a standard `validate()` wrapper around Zod parsing that
 * returns consistent `ApiResponse`-shaped errors.
 * Also includes helpers for formatting errors and inferring types.
 *
 * @example
 * import { validate } from "@/lib/validation/utils";
 * import { loginSchema } from "@/features/auth/schemas/login-schema";
 *
 * const result = validate(loginSchema, { email, password });
 * if (!result.success) {
 *   return result; // { success: false, message: "...", errors: {...} }
 * }
 * // result.data is typed as LoginFormValues
 */

import { z } from "zod";
import type { ApiResponse } from "@/types/api";
import { MESSAGES } from "@/constants/messages";

// ─── Types ─────────────────────────────────────────

/** Parsed validation result with typed data on success. */
export type ValidationResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: ValidationError };

/** Structured error object matching ApiResponse errors field. */
export interface ValidationError {
  message: string;
  fieldErrors?: Record<string, string[]>;
  formErrors?: string[];
}

// ─── Formatting ────────────────────────────────────

/**
 * Formats a ZodError into a structured `ValidationError` object.
 * Extracts field-level and form-level errors for use in forms and API responses.
 *
 * @param zodError - The ZodError from a failed parse
 * @returns Structured error object
 *
 * @example
 * const result = schema.safeParse(input);
 * if (!result.success) {
 *   const error = formatZodError(result.error);
 *   // error.fieldErrors.email[0] === "Invalid email"
 * }
 */
export function formatZodError(zodError: z.ZodError): ValidationError {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of zodError.issues) {
    const path = issue.path.join(".") || "_form";

    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }

    fieldErrors[path].push(issue.message);
  }

  // Extract form-level errors (issues with no specific path)
  const formErrors = fieldErrors["_form"] ?? [];
  delete fieldErrors["_form"];

  return {
    message: MESSAGES.ERROR.VALIDATION_ERROR,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    formErrors: formErrors.length > 0 ? formErrors : undefined,
  };
}

/**
 * Converts a ZodError to an ApiResponse-compatible format.
 * Useful for server actions that return ApiResponse.
 *
 * @param zodError - The ZodError
 * @returns ApiResponse with field errors formatted
 */
export function zodErrorToApiResponse(zodError: z.ZodError): ApiResponse {
  const formatted = formatZodError(zodError);

  return {
    success: false,
    message: formatted.message,
    errors: formatted.fieldErrors,
  };
}

// ─── Validate Helper ──────────────────────────────

/**
 * Parses and validates data against a Zod schema.
 * Returns a discriminated union: `{ success: true, data: T }` or `{ success: false, error: ValidationError }`.
 *
 * Unlike Zod's `.safeParse()`, this formats errors consistently
 * and is designed for use in server actions and API routes.
 *
 * @param schema - The Zod schema to validate against
 * @param data - The raw data to validate
 * @returns Typed validation result
 *
 * @example
 * const result = validate(loginSchema, formData);
 * if (!result.success) {
 *   return { success: false, message: result.error.message, errors: result.error.fieldErrors };
 * }
 * const { email, password } = result.data;
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: formatZodError(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/**
 * Parses raw FormData against a Zod schema.
 * Converts FormData to an object first, then validates.
 *
 * @param schema - The Zod schema
 * @param formData - Raw FormData from a form submission
 * @param mapping - Optional mapping of form field names to schema keys
 * @returns Typed validation result
 *
 * @example
 * const result = validateFormData(loginSchema, formData);
 * // or with field mapping:
 * const result = validateFormData(loginSchema, formData, {
 *   "user-email": "email",
 * });
 */
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData,
  mapping: Record<string, string> = {},
): ValidationResult<T> {
  const rawObject: Record<string, unknown> = {};

  // Build reverse mapping
  const reverseMap: Record<string, string> = {};
  for (const [formKey, schemaKey] of Object.entries(mapping)) {
    reverseMap[formKey] = schemaKey;
  }

  formData.forEach((value, key) => {
    const schemaKey = reverseMap[key] ?? key;

    // Handle checkboxes: if the same key appears multiple times, collect as array
    if (rawObject[schemaKey] !== undefined) {
      const existing = rawObject[schemaKey];
      rawObject[schemaKey] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      // Attempt to parse boolean values from checkboxes
      if (value === "true") rawObject[schemaKey] = true;
      else if (value === "false") rawObject[schemaKey] = false;
      else rawObject[schemaKey] = value;
    }
  });

  return validate(schema, rawObject);
}

/**
 * Creates a server-action-friendly wrapper that validates input
 * and returns an `ApiResponse` on failure.
 *
 * @param schema - The Zod schema
 * @param handler - The action handler receiving validated data
 * @returns A server action that validates first, then executes
 *
 * @example
 * export const loginAction = withValidation(loginSchema, async (data, formData) => {
 *   // data is typed as LoginFormValues
 *   await authService.login(data.email, data.password);
 *   return { success: true, message: "Logged in" };
 * });
 */
export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (data: T, formData: FormData) => Promise<ApiResponse>,
) {
  return async (_prevState: ApiResponse | null, formData: FormData): Promise<ApiResponse> => {
    const result = validateFormData(schema, formData);

    if (!result.success) {
      return {
        success: false,
        message: result.error.message,
        errors: result.error.fieldErrors,
      };
    }

    return handler(result.data, formData);
  };
}

// ─── Type Helpers ─────────────────────────────────

/**
 * Infers the input type of a Zod schema (before defaults/transformations).
 *
 * @example
 * type Input = InferInput<typeof mySchema>;
 */
export type InferInput<T extends z.ZodTypeAny> = z.input<T>;

/**
 * Infers the output type of a Zod schema (after defaults/transformations).
 *
 * @example
 * type Output = InferOutput<typeof mySchema>;
 */
export type InferOutput<T extends z.ZodTypeAny> = z.output<T>;

// ─── Field Error Extraction ──────────────────────

/**
 * Extracts a single field's error messages from a ZodError.
 *
 * @param error - The ZodError
 * @param field - The field path
 * @returns Array of error messages for the field
 *
 * @example
 * const emailErrors = getFieldError(result.error, "email");
 * // ["Please enter a valid email address"]
 */
export function getFieldError(error: z.ZodError | null, field: string): string[] | undefined {
  if (!error) return undefined;

  const issues = error.issues.filter(
    (issue) => issue.path.join(".") === field || issue.path[0] === field,
  );

  return issues.length > 0 ? issues.map((i) => i.message) : undefined;
}
