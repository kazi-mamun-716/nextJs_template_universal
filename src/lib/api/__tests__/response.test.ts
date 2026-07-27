/**
 * Unit tests for src/lib/api/response.ts
 *
 * Tests both Server Action response builders (success, error, paginated)
 * and NextResponse helpers (ok, created, badRequest, unauthorized, etc.).
 */

import { describe, it, expect, vi } from "vitest";

// ─── Mock Next/Server ──────────────────────────

vi.mock("next/server", () => {
  class MockNextResponse {
    body: unknown;
    status: number;
    headers: Record<string, string>;

    constructor(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      this.body = body;
      this.status = init?.status ?? 200;
      this.headers = init?.headers ?? {};
    }

    static json(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      return new MockNextResponse(body, init);
    }

    async json() {
      return this.body;
    }
  }

  class MockNextRequest {
    url: string;
    json: ReturnType<typeof vi.fn>;
    headers: Map<string, string>;
    nextUrl: { pathname: string };

    constructor(input?: string) {
      this.url = input ?? "http://localhost:3000";
      this.json = vi.fn();
      this.headers = new Map();
      this.nextUrl = { pathname: "/" };
    }
  }

  return { NextResponse: MockNextResponse, NextRequest: MockNextRequest };
});

import {
  success,
  error,
  paginated,
  jsonSuccess,
  jsonError,
  jsonPaginated,
  ok,
  created,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessable,
  tooManyRequests,
  serverError,
} from "../response";

// ─── Server Action Response Builders ──────────────

describe("success()", () => {
  it("returns a success response with default message when no args", () => {
    const result = success();
    expect(result).toEqual({
      success: true,
      message: "Operation completed successfully.",
    });
  });

  it("includes data when provided", () => {
    const result = success({ id: "123", name: "Test" });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: "123", name: "Test" });
  });

  it("uses custom message when provided", () => {
    const result = success(undefined, "Custom message");
    expect(result.message).toBe("Custom message");
  });

  it("omits data key when data is undefined", () => {
    const result = success();
    expect(result).not.toHaveProperty("data");
  });
});

describe("error()", () => {
  it("returns an error response with default message", () => {
    const result = error();
    expect(result).toEqual({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  });

  it("includes field errors when provided", () => {
    const result = error("Validation failed", { email: ["Invalid email"] });
    expect(result.success).toBe(false);
    expect(result.message).toBe("Validation failed");
    expect(result.errors).toEqual({ email: ["Invalid email"] });
  });

  it("omits errors key when not provided", () => {
    const result = error("Something went wrong");
    expect(result).not.toHaveProperty("errors");
  });

  it("accepts custom message", () => {
    const result = error("Custom error");
    expect(result.message).toBe("Custom error");
  });
});

describe("paginated()", () => {
  it("returns a paginated response with computed totalPages", () => {
    const data = [{ id: 1 }];
    const result = paginated(data, { page: 1, pageSize: 10, total: 25 });

    expect(result.success).toBe(true);
    expect(result.data).toEqual(data);
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 10,
      total: 25,
      totalPages: 3,
      hasNext: true,
      hasPrevious: false,
    });
  });

  it("accepts explicit totalPages override", () => {
    const result = paginated([], { page: 1, pageSize: 10, total: 25, totalPages: 5 });
    expect(result.pagination.totalPages).toBe(5);
    expect(result.pagination.hasNext).toBe(true);
    expect(result.pagination.hasPrevious).toBe(false);
  });

  it("correctly computes hasNext and hasPrevious", () => {
    const data = [{ id: 1 }];
    const middlePage = paginated(data, { page: 2, pageSize: 1, total: 3 });
    expect(middlePage.pagination.hasNext).toBe(true);
    expect(middlePage.pagination.hasPrevious).toBe(true);

    const lastPage = paginated(data, { page: 3, pageSize: 1, total: 3 });
    expect(lastPage.pagination.hasNext).toBe(false);
    expect(lastPage.pagination.hasPrevious).toBe(true);

    const firstPage = paginated(data, { page: 1, pageSize: 1, total: 3 });
    expect(firstPage.pagination.hasNext).toBe(true);
    expect(firstPage.pagination.hasPrevious).toBe(false);
  });

  it("handles empty data array", () => {
    const result = paginated([], { page: 1, pageSize: 10, total: 0 });
    expect(result.pagination.totalPages).toBe(0);
    expect(result.pagination.hasNext).toBe(false);
    expect(result.pagination.hasPrevious).toBe(false);
  });

  it("uses custom message", () => {
    const result = paginated([], { page: 1, pageSize: 10, total: 0 }, "Custom update");
    expect(result.message).toBe("Custom update");
  });
});

// ─── NextResponse Builders ───────────────────────

describe("jsonSuccess()", () => {
  it("returns 200 with success body", () => {
    const response = jsonSuccess({ id: "123" }) as unknown as {
      status: number;
      body: Record<string, unknown>;
    };
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Operation completed successfully.",
      data: { id: "123" },
    });
  });

  it("accepts custom status and message", () => {
    const response = jsonSuccess({ id: "123" }, 201, "Created") as unknown as {
      status: number;
      body: { message: string };
    };
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Created");
  });
});

describe("jsonError()", () => {
  it("returns 500 with error body", () => {
    const response = jsonError("Server error") as unknown as {
      status: number;
      body: Record<string, unknown>;
    };
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: "Server error",
    });
  });

  it("accepts custom status", () => {
    const response = jsonError("Not found", 404) as unknown as {
      status: number;
      body: { message: string };
    };
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not found");
  });
});

describe("jsonPaginated()", () => {
  it("returns 200 with paginated body", () => {
    const response = jsonPaginated([{ id: 1 }], { page: 1, pageSize: 10, total: 1 }) as unknown as {
      status: number;
      body: Record<string, unknown>;
    };
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.pagination).toBeDefined();
  });
});

// ─── Common HTTP Response Helpers ────────────────

describe("HTTP response helpers", () => {
  it("ok() returns 200", () => {
    const response = ok() as unknown as { status: number; body: Record<string, unknown> };
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("created() returns 201", () => {
    const response = created({ id: "123" }) as unknown as {
      status: number;
      body: Record<string, unknown>;
    };
    expect(response.status).toBe(201);
    expect(response.body.data).toEqual({ id: "123" });
  });

  it("noContent() returns 204 with null body", () => {
    const response = noContent() as unknown as { status: number; body: null };
    expect(response.status).toBe(204);
    expect(response.body).toBeNull();
  });

  it("badRequest() returns 400", () => {
    const response = badRequest() as unknown as { status: number; body: Record<string, unknown> };
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("badRequest() includes field errors", () => {
    const response = badRequest("Invalid", { name: ["Required"] }) as unknown as {
      status: number;
      body: Record<string, unknown>;
    };
    expect((response.body as Record<string, unknown>).errors).toEqual({ name: ["Required"] });
  });

  it("unauthorized() returns 401", () => {
    const response = unauthorized() as unknown as { status: number; body: Record<string, unknown> };
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("forbidden() returns 403", () => {
    const response = forbidden() as unknown as { status: number };
    expect(response.status).toBe(403);
  });

  it("notFound() returns 404", () => {
    const response = notFound() as unknown as { status: number };
    expect(response.status).toBe(404);
  });

  it("conflict() returns 409", () => {
    const response = conflict() as unknown as { status: number };
    expect(response.status).toBe(409);
  });

  it("unprocessable() returns 422", () => {
    const response = unprocessable() as unknown as { status: number };
    expect(response.status).toBe(422);
  });

  it("unprocessable() includes field errors", () => {
    const response = unprocessable("Validation failed", { email: ["Required"] }) as unknown as {
      status: number;
      body: Record<string, unknown>;
    };
    expect((response.body as Record<string, unknown>).errors).toEqual({ email: ["Required"] });
  });

  it("tooManyRequests() returns 429", () => {
    const response = tooManyRequests() as unknown as { status: number };
    expect(response.status).toBe(429);
  });

  it("serverError() returns 500", () => {
    const response = serverError() as unknown as { status: number };
    expect(response.status).toBe(500);
  });
});
