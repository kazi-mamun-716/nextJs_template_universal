/**
 * Vitest setup: Node.js environment.
 *
 * Runs before every test file.
 * Configures global mocks, polyfills, and test-time utilities
 * needed by all unit tests.
 *
 * Mock cleanup is handled by vitest config (clearMocks + restoreMocks).
 */

import { vi } from "vitest";

// ─── Global Fetch Mock ──────────────────────────

/**
 * `fetch` is not available in Node.js by default.
 * Provide a clear error if fetch is accidentally used without mocking.
 */
if (typeof globalThis.fetch === "undefined") {
  globalThis.fetch = vi
    .fn()
    .mockRejectedValue(
      new Error("fetch is not mocked. Use vi.fn() or mock the module that uses fetch."),
    );
}

// ─── Console Error Filtering ────────────────────

/**
 * Suppress expected error patterns in test output.
 * Unexpected errors (not matching known patterns) will still surface.
 */
const originalConsoleError = console.error;
const suppressedErrorPatterns: string[] = [];

console.error = vi.fn((...args: unknown[]) => {
  const message = typeof args[0] === "string" ? args[0] : String(args[0] ?? "");
  if (suppressedErrorPatterns.some((pattern) => message.includes(pattern))) {
    return;
  }
  originalConsoleError(...args);
});

// ─── Process Environment ────────────────────────

/**
 * Ensure NODE_ENV is set for tests.
 * Uses a type assertion because the property is declared as readonly.
 */
(process.env as Record<string, string>).NODE_ENV = "test";
