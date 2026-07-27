/**
 * Route handler wrapper.
 *
 * Provides decorators for Next.js App Router route handlers (`route.ts`).
 * Wraps handlers with authentication checks, body validation, and error handling
 * so individual routes don't need to repeat this boilerplate.
 *
 * @example
 * import { withAuth, withValidation } from "@/lib/api/handler";
 * import { z } from "zod";
 *
 * const schema = z.object({ name: z.string() });
 *
 * export const POST = withAuth(async (request, { user }) => {
 *   const body = await withValidation(request, schema);
 *   return ok(body);
 * });
 */

import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { HTTP_STATUS } from "@/constants/api-status";
import { MESSAGES } from "@/constants/messages";
import { jsonError, ok, error } from "./response";
import { ApiError, handleApiError, UnauthorizedError } from "./errors";
import type { ApiResponse } from "@/types/api";

// ─── Types ─────────────────────────────────────────

/** Authenticated request context with user data. */
export interface AuthContext {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

/** Handler function with authentication context. */
export type AuthenticatedHandler<T extends NextResponse = NextResponse> = (
  request: NextRequest,
  context: AuthContext,
) => Promise<T>;

/** Options for withAuth. */
export interface AuthOptions {
  /** Whether authentication is required (default: true). */
  required?: boolean;
  /** Required roles to access the route. */
  roles?: string[];
}

// ─── Auth Wrapper ────────────────────────────────

export function withAuth<T extends NextResponse = NextResponse>(
  handler: AuthenticatedHandler<T>,
  options: AuthOptions = {},
): (request: NextRequest) => Promise<T> {
  return async (request: NextRequest): Promise<T> => {
    try {
      const session = await auth();
      const isAuthenticated = !!session?.user;

      if (options.required !== false && !isAuthenticated) {
        throw new UnauthorizedError();
      }

      const user = isAuthenticated
        ? {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            role: session.user.role,
          }
        : { id: "", role: undefined };

      if (options.roles && options.roles.length > 0) {
        const userRole = user.role;
        if (!userRole || !options.roles.includes(userRole)) {
          return jsonError(MESSAGES.API.FORBIDDEN, HTTP_STATUS.FORBIDDEN) as T;
        }
      }

      return handler(request, { user });
    } catch (error) {
      return handleApiError(error) as T;
    }
  };
}

// ─── Validation Wrapper ──────────────────────────

export async function withValidation<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
): Promise<T> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error;
    }

    throw new ApiError(
      MESSAGES.API.BAD_REQUEST,
      HTTP_STATUS.BAD_REQUEST,
    );
  }
}

// ─── Error Handling Wrapper ──────────────────────

export function withErrorHandling<T extends NextResponse = NextResponse>(
  handler: (request: NextRequest) => Promise<T>,
): (request: NextRequest) => Promise<T> {
  return async (request: NextRequest): Promise<T> => {
    try {
      return await handler(request);
    } catch (error) {
      return handleApiError(error) as T;
    }
  };
}

// ─── Method Not Allowed ─────────────────────────

export function methodNotAllowed(allowedMethods: string[]) {
  return NextResponse.json(
    error(`Method not allowed. Supported: ${allowedMethods.join(", ")}`),
    {
      status: HTTP_STATUS.METHOD_NOT_ALLOWED,
      headers: { Allow: allowedMethods.join(", ") },
    },
  );
}
