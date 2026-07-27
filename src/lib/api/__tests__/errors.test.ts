/**
 * Unit tests for src/lib/api/errors.ts
 *
 * Tests all error classes (ApiError, BadRequestError, UnauthorizedError, etc.)
 * and the handleApiError function for ApiError, ZodError, and unknown errors.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// ─── Mock Next/Server ──────────────────────────

vi.mock("next/server", () => {
  class MockNextResponse {
    body: unknown;
    status: number;

    constructor(body: unknown, init?: { status?: number }) {
      this.body = body;
      this.status = init?.status ?? 200;
    }

    static json(body: unknown, init?: { status?: number }) {
      return new MockNextResponse(body, init);
    }

    async json() {
      return this.body;
    }
  }

  return { NextResponse: MockNextResponse };
});

import {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  handleApiError,
} from "../errors";

// ─── Base ApiError ──────────────────────────────

describe("ApiError", () => {
  it("creates an error with message, status code, and optional errors", () => {
    const error = new ApiError("Test error", 400, { field: ["error"] });
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(400);
    expect(error.errors).toEqual({ field: ["error"] });
    expect(error.name).toBe("ApiError");
  });

  it("defaults to 500 when no status code is provided", () => {
    const error = new ApiError("Server error");
    expect(error.statusCode).toBe(500);
  });

  it("has undefined errors when not provided", () => {
    const error = new ApiError("No field errors");
    expect(error.errors).toBeUndefined();
  });
});

// ─── Specific Error Classes ──────────────────────

describe("BadRequestError", () => {
  it("creates a 400 error with optional field errors", () => {
    // @ts-expect-error - Testing that custom message is accepted (default is a literal type)
    const error = new BadRequestError("Bad input", { email: ["Invalid"] });
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe("BadRequestError");
    expect(error.errors).toEqual({ email: ["Invalid"] });
  });

  it("uses default message when not provided", () => {
    const error = new BadRequestError();
    expect(error.message).toBe("Invalid request. Please check your input.");
  });
});

describe("UnauthorizedError", () => {
  it("creates a 401 error", () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(401);
    expect(error.name).toBe("UnauthorizedError");
  });

  it("accepts custom message", () => {
    // @ts-expect-error - Testing that custom message is accepted (default is a literal type)
    const error = new UnauthorizedError("Custom unauthorized");
    expect(error.message).toBe("Custom unauthorized");
  });
});

describe("ForbiddenError", () => {
  it("creates a 403 error", () => {
    const error = new ForbiddenError();
    expect(error.statusCode).toBe(403);
    expect(error.name).toBe("ForbiddenError");
  });
});

describe("NotFoundError", () => {
  it("creates a 404 error", () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe("NotFoundError");
  });
});

describe("ConflictError", () => {
  it("creates a 409 error", () => {
    const error = new ConflictError();
    expect(error.statusCode).toBe(409);
    expect(error.name).toBe("ConflictError");
  });
});

describe("ValidationError", () => {
  it("creates a 422 error with field errors (required)", () => {
    const error = new ValidationError({ email: ["Invalid email"], name: ["Required"] });
    expect(error.statusCode).toBe(422);
    expect(error.name).toBe("ValidationError");
    expect(error.errors).toEqual({ email: ["Invalid email"], name: ["Required"] });
  });

  it("accepts custom message", () => {
    // @ts-expect-error - Testing that custom message is accepted (default is a literal type)
    const error = new ValidationError({ field: ["err"] }, "Custom validation");
    expect(error.message).toBe("Custom validation");
  });
});

describe("RateLimitError", () => {
  it("creates a 429 error", () => {
    const error = new RateLimitError();
    expect(error.statusCode).toBe(429);
    expect(error.name).toBe("RateLimitError");
  });
});

// ─── Error Handler ──────────────────────────────

describe("handleApiError()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes through ApiError instances", () => {
    const apiError = new ApiError("Custom error", 422);
    const response = handleApiError(apiError) as unknown as {
      status: number;
      body: Record<string, unknown>;
    };

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("Custom error");
  });

  it("passes through errors with field errors", () => {
    // @ts-expect-error - Testing that field errors pass through handleApiError
    const apiError = new BadRequestError("Invalid", { name: ["Required"] });
    const response = handleApiError(apiError) as unknown as {
      status: number;
      body: Record<string, unknown>;
    };

    expect(response.status).toBe(400);
    expect((response.body as Record<string, unknown>).errors).toEqual({ name: ["Required"] });
  });

  it("handles ZodError with field errors", () => {
    const schema = z.object({
      email: z.string().email("Invalid email"),
      name: z.string().min(2, "Name too short"),
    });

    const result = schema.safeParse({ email: "bad", name: "a" });
    expect(result.success).toBe(false);

    if (!result.success) {
      const response = handleApiError(result.error) as unknown as {
        status: number;
        body: Record<string, unknown>;
      };
      expect(response.status).toBe(422);
      expect(response.body.message).toBe("Validation failed. Please check your input.");
      expect((response.body as Record<string, unknown>).errors).toBeDefined();
    }
  });

  it("handles ZodError with form-level error for empty path", () => {
    const schema = z.object({}).refine(() => false, { message: "Form error" });
    const result = schema.safeParse({});
    expect(result.success).toBe(false);

    if (!result.success) {
      const response = handleApiError(result.error) as unknown as {
        status: number;
        body: Record<string, unknown>;
      };
      expect(response.status).toBe(422);
    }
  });

  it("handles unknown errors with a generic 500 message", () => {
    const response = handleApiError(new Error("Something broke")) as unknown as {
      status: number;
      body: Record<string, unknown>;
    };

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error.");
    expect(response.body.success).toBe(false);
  });

  it("handles non-Error unknown values with a generic 500 message", () => {
    const response = handleApiError("string error") as unknown as {
      status: number;
      body: Record<string, unknown>;
    };
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error.");
  });

  it("handles null gracefully", () => {
    const response = handleApiError(null) as unknown as { status: number };
    expect(response.status).toBe(500);
  });

  it("handles plain objects that are not Error instances", () => {
    const response = handleApiError({ some: "object" }) as unknown as { status: number };
    expect(response.status).toBe(500);
  });
});
