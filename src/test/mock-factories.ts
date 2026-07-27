/**
 * Mock factories for testing.
 *
 * Provides reusable factory functions for creating mock objects
 * used across test files. Each factory creates a fresh object
 * with sensible defaults, and accepts overrides for test-specific values.
 *
 * @example
 * import { mockUser, mockRequest, mockResponse } from "@/test/mock-factories";
 *
 * const user = mockUser({ role: "admin" });
 * const req = mockRequest({ url: "/api/test" });
 * const res = mockResponse({ status: 200, body: { data: "ok" } });
 */

import { vi } from "vitest";

// ─── User ───────────────────────────────────────

export interface MockUserOverrides {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

/**
 * Creates a mock user object for auth/session tests.
 */
export function mockUser(overrides: MockUserOverrides = {}) {
  return {
    id: overrides.id ?? "user_123",
    name: overrides.name ?? "Test User",
    email: overrides.email ?? "test@example.com",
    image: overrides.image ?? null,
    role: overrides.role ?? "user",
  };
}

// ─── Session ────────────────────────────────────

export interface MockSessionOverrides {
  user?: MockUserOverrides;
  expires?: string;
}

/**
 * Creates a mock Auth.js session object.
 */
export function mockSession(overrides: MockSessionOverrides = {}) {
  return {
    user: mockUser(overrides.user),
    expires: overrides.expires ?? new Date(Date.now() + 86400000).toISOString(),
  };
}

// ─── NextRequest ───────────────────────────────

export interface MockRequestOverrides {
  url?: string;
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  searchParams?: Record<string, string>;
}

/**
 * Creates a mock NextRequest-like object.
 * For full request mocking, use vi.mock("next/server") in the test file.
 */
export function mockRequest(overrides: MockRequestOverrides = {}) {
  const url = overrides.url ?? "http://localhost:3000/api/test";
  const { pathname, searchParams } = new URL(url);

  return {
    url,
    method: overrides.method ?? "GET",
    headers: new Map(Object.entries(overrides.headers ?? {})),
    nextUrl: {
      pathname,
      searchParams: new URLSearchParams(overrides.searchParams ?? {}),
    },
    json: vi.fn().mockResolvedValue(overrides.body ?? {}),
    clone: vi.fn().mockReturnThis(),
    text: vi.fn().mockResolvedValue(JSON.stringify(overrides.body ?? {})),
    formData: vi.fn(),
  };
}

// ─── NextResponse ──────────────────────────────

export interface MockResponseOverrides {
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Creates a mock NextResponse-like object.
 * For full response mocking, use vi.mock("next/server") in the test file.
 */
export function mockResponse(overrides: MockResponseOverrides = {}) {
  return {
    body: overrides.body ?? null,
    status: overrides.status ?? 200,
    headers: overrides.headers ?? {},
    json: vi.fn().mockResolvedValue(overrides.body ?? {}),
  };
}

// ─── FormData ──────────────────────────────────

/**
 * Creates a FormData object from a plain object.
 * Useful for testing server actions that receive FormData.
 */
export function createFormData(values: Record<string, string | boolean | number>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(values)) {
    fd.append(key, String(value));
  }
  return fd;
}

// ─── Pagination ────────────────────────────────

export interface MockPaginationOverrides {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

/**
 * Creates mock pagination metadata.
 */
export function mockPagination(overrides: MockPaginationOverrides = {}) {
  const page = overrides.page ?? 1;
  const pageSize = overrides.pageSize ?? 10;
  const total = overrides.total ?? 100;
  const totalPages = overrides.totalPages ?? Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: overrides.hasNext ?? page < totalPages,
    hasPrevious: overrides.hasPrevious ?? page > 1,
  };
}

// ─── API Response ──────────────────────────────

export interface MockApiResponseOverrides<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Creates a mock API response object matching the ApiResponse type.
 */
export function mockApiResponse<T = unknown>(overrides: MockApiResponseOverrides<T> = {}) {
  return {
    success: overrides.success ?? true,
    message: overrides.message ?? "Success",
    ...(overrides.data !== undefined ? { data: overrides.data } : {}),
    ...(overrides.errors !== undefined ? { errors: overrides.errors } : {}),
  };
}

// ─── MongoDB ObjectId ──────────────────────────

/**
 * Generates a mock MongoDB ObjectId (24 hex chars).
 */
export function mockObjectId(): string {
  const chars = "0123456789abcdef";
  return Array.from({ length: 24 }, () => chars[Math.floor(Math.random() * 16)]).join("");
}

// ─── Date ──────────────────────────────────────

/**
 * Creates a mock date that can be frozen using vi.useFakeTimers().
 * Returns the Date constructor so tests can control time.
 */
export function mockDate(isoString?: string): Date {
  return new Date(isoString ?? "2026-01-15T00:00:00.000Z");
}

// ─── Error ──────────────────────────────────────

/**
 * Creates a mock API error with status code.
 */
export function mockApiError(
  status: number = 500,
  message: string = "Error",
  errors?: Record<string, string[]>,
) {
  return {
    statusCode: status,
    message,
    errors,
    name: "ApiError",
  };
}
