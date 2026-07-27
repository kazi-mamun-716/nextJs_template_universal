/**
 * Server action helper.
 *
 * Provides a typed `createAction` factory that combines:
 * 1. Zod validation (via `validateFormData`)
 * 2. Authentication check (via `auth()`)
 * 3. Consistent error handling
 * 4. Compatible with `useActionState`
 *
 * This reduces boilerplate in server action files to just the business logic.
 *
 * @example
 * import { createAction } from "@/lib/api/action";
 * import { fields } from "@/lib/validation";
 * import { z } from "zod";
 *
 * const schema = z.object({ email: fields.email(), name: fields.name() });
 *
 * export const updateProfile = createAction({
 *   schema,
 *   requireAuth: true,
 *   handler: async (data, { userId }) => {
 *     await db.user.update(userId, data);
 *     return success("Profile updated");
 *   },
 * });
 */

import { auth } from "@/lib/auth";
import { z } from "zod";
import { validateFormData, formatZodError } from "@/lib/validation/utils";
import { MESSAGES } from "@/constants/messages";
import type { ApiResponse } from "@/types/api";

// ─── Types ─────────────────────────────────────────

/** Configuration for createAction. */
export interface ActionConfig<T> {
  /** Zod schema to validate form data against. */
  schema: z.ZodSchema<T>;
  /** Whether authentication is required (default: true). */
  requireAuth?: boolean;
  /** Array of roles allowed to perform the action. */
  allowedRoles?: string[];
  /** The handler function that runs on successful validation and auth. */
  handler: (
    data: T,
    context: { userId: string; formData: FormData },
  ) => Promise<ApiResponse>;
}

// ─── Action Creator ──────────────────────────────

/**
 * Creates a server action compatible with `useActionState`.
 * Handles validation, authentication, role checks, and error handling.
 *
 * @param config - Action configuration
 * @returns A server action function `(prevState, formData) => Promise<ApiResponse>`
 *
 * @example
 * export const loginAction = createAction({
 *   schema: loginSchema,
 *   requireAuth: false,
 *   handler: async ({ email, password }) => {
 *     const result = await signIn("credentials", { email, password, redirect: false });
 *     if (result?.error) return error("Invalid credentials");
 *     return success("Logged in");
 *   },
 * });
 */
export function createAction<T>(
  config: ActionConfig<T>,
) {
  const { schema, requireAuth = true, allowedRoles, handler } = config;

  return async (
    _prevState: ApiResponse | null,
    formData: FormData,
  ): Promise<ApiResponse> => {
    // ── 1. Validate form data ──
    const validation = validateFormData(schema, formData);
    if (!validation.success) {
      return {
        success: false,
        message: validation.error.message,
        errors: validation.error.fieldErrors,
      };
    }

    // ── 2. Check authentication ──
    if (requireAuth) {
      const session = await auth();
      if (!session?.user?.id) {
        return {
          success: false,
          message: MESSAGES.ERROR.UNAUTHORIZED,
        };
      }

      // ── 3. Check role-based access ──
      if (allowedRoles && allowedRoles.length > 0) {
        const userRole = session.user.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
          return {
            success: false,
            message: MESSAGES.ERROR.FORBIDDEN,
          };
        }
      }

      // ── 4. Execute handler with authenticated context ──
      return handler(validation.data, {
        userId: session.user.id,
        formData,
      });
    }

    // ── 4. (no auth) Execute handler directly ──
    return handler(validation.data, {
      userId: "",
      formData,
    });
  };
}
