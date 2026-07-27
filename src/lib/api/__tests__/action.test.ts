/**
 * Unit tests for src/lib/api/action.ts
 *
 * Tests the createAction factory: form data validation, authentication,
 * role-based access control, and handler execution.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// ─── Mocks ──────────────────────────────────────

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

const mockValidateFormData = vi.fn();
vi.mock("@/lib/validation/utils", () => ({
  validateFormData: (...args: unknown[]) => mockValidateFormData(...args),
  formatZodError: vi.fn(),
}));

import { createAction } from "../action";
import type { ApiResponse } from "@/types/api";

// ─── Helpers ────────────────────────────────────

function createFormData(values: Record<string, string | boolean>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(values)) {
    fd.append(key, String(value));
  }
  return fd;
}

// ─── createAction Tests ─────────────────────────

describe("createAction()", () => {
  const testSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns validation errors when form data is invalid", async () => {
    mockValidateFormData.mockReturnValueOnce({
      success: false,
      error: {
        message: "Validation failed. Please check your input.",
        fieldErrors: { email: ["Invalid email"] },
      },
    });

    const action = createAction({
      schema: testSchema,
      requireAuth: false,
      handler: vi.fn(),
    });

    const result = await action(null, createFormData({ name: "John", email: "bad" }));

    expect(result.success).toBe(false);
    expect(result.message).toBe("Validation failed. Please check your input.");
    expect(result.errors).toEqual({ email: ["Invalid email"] });
  });

  it("returns unauthorized when not authenticated and auth is required", async () => {
    mockValidateFormData.mockReturnValueOnce({
      success: true,
      data: { name: "John", email: "john@example.com" },
    });

    mockAuth.mockResolvedValueOnce({ user: null });

    const action = createAction({
      schema: testSchema,
      requireAuth: true,
      handler: vi.fn(),
    });

    const result = await action(null, createFormData({ name: "John", email: "john@example.com" }));

    expect(result.success).toBe(false);
    expect(result.message).toBe("You are not authorized to perform this action.");
  });

  it("executes handler when validation and auth succeed", async () => {
    mockValidateFormData.mockReturnValueOnce({
      success: true,
      data: { name: "John", email: "john@example.com" },
    });

    mockAuth.mockResolvedValueOnce({
      user: { id: "user_123", role: "user" },
    });

    const handler = vi.fn(async (_data: unknown, _ctx: unknown): Promise<ApiResponse> => {
      return { success: true, message: "Done" };
    });

    const action = createAction({
      schema: testSchema,
      handler,
    });

    const result = await action(null, createFormData({ name: "John", email: "john@example.com" }));

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      { name: "John", email: "john@example.com" },
      { userId: "user_123", formData: expect.any(FormData) },
    );
    expect(result.success).toBe(true);
    expect(result.message).toBe("Done");
  });

  it("returns forbidden when user does not have the required role", async () => {
    mockValidateFormData.mockReturnValueOnce({
      success: true,
      data: { name: "John", email: "john@example.com" },
    });

    mockAuth.mockResolvedValueOnce({
      user: { id: "user_123", role: "user" },
    });

    const action = createAction({
      schema: testSchema,
      allowedRoles: ["admin"],
      handler: vi.fn(),
    });

    const result = await action(null, createFormData({ name: "John", email: "john@example.com" }));

    expect(result.success).toBe(false);
    expect(result.message).toBe("You do not have permission to access this resource.");
  });

  it("allows access when user has one of the allowed roles", async () => {
    mockValidateFormData.mockReturnValueOnce({
      success: true,
      data: { name: "John", email: "john@example.com" },
    });

    mockAuth.mockResolvedValueOnce({
      user: { id: "mod_1", role: "moderator" },
    });

    const handler = vi.fn(async () => ({ success: true, message: "OK" }));

    const action = createAction({
      schema: testSchema,
      allowedRoles: ["admin", "moderator"],
      handler,
    });

    const result = await action(null, createFormData({ name: "John", email: "john@example.com" }));

    expect(result.success).toBe(true);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("executes handler without auth when requireAuth is false", async () => {
    mockValidateFormData.mockReturnValueOnce({
      success: true,
      data: { name: "John", email: "john@example.com" },
    });

    const handler = vi.fn(async (_data: unknown, ctx: unknown) => {
      return { success: true, message: `Got userId: ${(ctx as { userId: string }).userId}` };
    });

    const action = createAction({
      schema: testSchema,
      requireAuth: false,
      handler,
    });

    const result = await action(null, createFormData({ name: "John", email: "john@example.com" }));

    expect(handler).toHaveBeenCalledTimes(1);
    expect(result.message).toBe("Got userId: ");
  });

  it("passes the formData to the handler context", async () => {
    mockValidateFormData.mockReturnValueOnce({
      success: true,
      data: { name: "John", email: "john@example.com" },
    });

    mockAuth.mockResolvedValueOnce({
      user: { id: "user_123", role: "user" },
    });

    const formData = createFormData({ name: "John", email: "john@example.com" });

    let passedFormData: FormData | null = null;

    const action = createAction({
      schema: testSchema,
      handler: async (_data, ctx) => {
        passedFormData = ctx.formData;
        return { success: true, message: "OK" };
      },
    });

    await action(null, formData);
    expect(passedFormData).toBe(formData);
  });

  it("handles null prevState gracefully", async () => {
    mockValidateFormData.mockReturnValueOnce({
      success: true,
      data: { name: "John", email: "john@example.com" },
    });

    mockAuth.mockResolvedValueOnce({
      user: { id: "user_123", role: "user" },
    });

    const action = createAction({
      schema: testSchema,
      handler: async () => ({ success: true, message: "OK" }),
    });

    const result = await action(null, createFormData({ name: "John", email: "john@example.com" }));
    expect(result.success).toBe(true);
  });

  it("accepts previous state for useActionState compatibility", async () => {
    mockValidateFormData.mockReturnValueOnce({
      success: true,
      data: { name: "John", email: "john@example.com" },
    });

    mockAuth.mockResolvedValueOnce({
      user: { id: "user_123", role: "user" },
    });

    const prevState: ApiResponse = { success: false, message: "Previous error" };

    const action = createAction({
      schema: testSchema,
      handler: async () => ({ success: true, message: "OK" }),
    });

    const result = await action(
      prevState,
      createFormData({ name: "John", email: "john@example.com" }),
    );
    expect(result.success).toBe(true);
  });
});
