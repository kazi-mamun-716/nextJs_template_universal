/**
 * Unit tests for src/lib/api/handler.ts
 *
 * Tests handler wrappers: withAuth, withValidation, withErrorHandling, methodNotAllowed.
 * Mocks Auth.js and Next.js server dependencies.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// ─── Mocks ──────────────────────────────────────

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

// Mock Auth.js
const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

import { NextResponse, NextRequest } from "next/server";
import {
  withAuth,
  withValidation,
  withErrorHandling,
  methodNotAllowed,
  type AuthContext,
} from "../handler";
import { UnauthorizedError } from "../errors";

// ─── withAuth Tests ─────────────────────────────

describe("withAuth()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes authenticated user context to the handler", async () => {
    mockAuth.mockResolvedValueOnce({
      user: {
        id: "user_123",
        name: "Test User",
        email: "test@example.com",
        role: "user",
        image: null,
      },
    });

    const handler = vi.fn(async (_req: NextRequest, ctx: AuthContext) => {
      return NextResponse.json({ userId: ctx.user.id, role: ctx.user.role });
    });

    const wrapped = withAuth(handler);
    const request = new NextRequest("http://localhost:3000/api/test");
    const response = (await wrapped(request)) as unknown as { status: number };

    expect(handler).toHaveBeenCalledTimes(1);
    const callContext = handler.mock.calls[0][1] as AuthContext;
    expect(callContext.user.id).toBe("user_123");
    expect(callContext.user.role).toBe("user");
    expect(response.status).toBe(200);
  });

  it("returns 401 when user is not authenticated and required is true", async () => {
    mockAuth.mockResolvedValueOnce({ user: null });

    const handler = vi.fn();
    const wrapped = withAuth(handler);
    const request = new NextRequest("http://localhost:3000/api/protected");
    const response = (await wrapped(request)) as unknown as { status: number };

    expect(handler).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  it("passes through when authentication is not required", async () => {
    mockAuth.mockResolvedValueOnce({ user: null });

    const handler = vi.fn(async (_req: NextRequest, ctx: AuthContext) => {
      return NextResponse.json({ userId: ctx.user.id });
    });

    const wrapped = withAuth(handler, { required: false });
    const request = new NextRequest("http://localhost:3000/api/public");
    const response = (await wrapped(request)) as unknown as { status: number };

    expect(handler).toHaveBeenCalledTimes(1);
    const callContext = handler.mock.calls[0][1] as AuthContext;
    expect(callContext.user.id).toBe("");
    expect(response.status).toBe(200);
  });

  it("returns 403 when user role is not in allowed roles", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "user_123", role: "user" },
    });

    const handler = vi.fn();
    const wrapped = withAuth(handler, { roles: ["admin"] });
    const request = new NextRequest("http://localhost:3000/api/admin");
    const response = (await wrapped(request)) as unknown as { status: number };

    expect(handler).not.toHaveBeenCalled();
    expect(response.status).toBe(403);
  });

  it("allows access when user has the required role", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "admin_1", role: "admin" },
    });

    const handler = vi.fn(async () => NextResponse.json({ ok: true }));
    const wrapped = withAuth(handler, { roles: ["admin"] });
    const request = new NextRequest("http://localhost:3000/api/admin");
    const response = (await wrapped(request)) as unknown as { status: number };

    expect(handler).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  });

  it("handles multiple allowed roles", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "mod_1", role: "moderator" },
    });

    const handler = vi.fn(async () => NextResponse.json({ ok: true }));
    const wrapped = withAuth(handler, { roles: ["admin", "moderator"] });
    const request = new NextRequest("http://localhost:3000/api/moderate");
    const response = (await wrapped(request)) as unknown as { status: number };

    expect(handler).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  });
});

// ─── withValidation Tests ───────────────────────

describe("withValidation()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("parses and validates request body against a schema", async () => {
    const schema = z.object({ name: z.string(), age: z.number() });

    const request = new NextRequest("http://localhost:3000/api/test");
    (request as unknown as { json: ReturnType<typeof vi.fn> }).json = vi
      .fn()
      .mockResolvedValueOnce({ name: "John", age: 30 });

    const data = await withValidation(request, schema);
    expect(data).toEqual({ name: "John", age: 30 });
  });

  it("throws ZodError for invalid body", async () => {
    const schema = z.object({ email: z.string().email() });

    const request = new NextRequest("http://localhost:3000/api/test");
    (request as unknown as { json: ReturnType<typeof vi.fn> }).json = vi
      .fn()
      .mockResolvedValueOnce({ email: "not-an-email" });

    await expect(withValidation(request, schema)).rejects.toThrow();
  });

  it("throws ApiError when request body is not valid JSON", async () => {
    const schema = z.object({ name: z.string() });

    const request = new NextRequest("http://localhost:3000/api/test");
    (request as unknown as { json: ReturnType<typeof vi.fn> }).json = vi
      .fn()
      .mockRejectedValueOnce(new SyntaxError("Unexpected token"));

    await expect(withValidation(request, schema)).rejects.toThrow();
  });

  it("throws ApiError on network errors during body parsing", async () => {
    const schema = z.object({ name: z.string() });

    const request = new NextRequest("http://localhost:3000/api/test");
    (request as unknown as { json: ReturnType<typeof vi.fn> }).json = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network error"));

    await expect(withValidation(request, schema)).rejects.toThrow();
  });
});

// ─── withErrorHandling Tests ────────────────────

describe("withErrorHandling()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the handler result on success", async () => {
    const handler = vi.fn(async () => NextResponse.json({ success: true }));
    const wrapped = withErrorHandling(handler);
    const request = new NextRequest("http://localhost:3000/api/test");
    const response = (await wrapped(request)) as unknown as {
      status: number;
      body: Record<string, unknown>;
    };

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("catches ApiError and returns JSON error response", async () => {
    const handler = vi.fn(async () => {
      throw new UnauthorizedError();
    });

    const wrapped = withErrorHandling(handler);
    const request = new NextRequest("http://localhost:3000/api/test");
    const response = (await wrapped(request)) as unknown as {
      status: number;
      body: Record<string, unknown>;
    };

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("catches unexpected errors and returns 500", async () => {
    const handler = vi.fn(async () => {
      throw new Error("Something broke");
    });

    const wrapped = withErrorHandling(handler);
    const request = new NextRequest("http://localhost:3000/api/test");
    const response = (await wrapped(request)) as unknown as {
      status: number;
      body: Record<string, unknown>;
    };

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
  });
});

// ─── methodNotAllowed Tests ─────────────────────

describe("methodNotAllowed()", () => {
  it("returns 405 with allowed methods header", () => {
    const response = methodNotAllowed(["GET", "POST"]) as unknown as {
      status: number;
      body: Record<string, unknown>;
      headers: Record<string, string>;
    };

    expect(response.status).toBe(405);
    expect(response.body.success).toBe(false);
    expect(response.headers.Allow).toBe("GET, POST");
  });

  it("lists a single method correctly", () => {
    const response = methodNotAllowed(["GET"]) as unknown as { headers: Record<string, string> };
    expect(response.headers.Allow).toBe("GET");
  });
});
