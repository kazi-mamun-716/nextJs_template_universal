/**
 * Vitest configuration.
 *
 * Supports three test environments:
 *   - "node"  → Unit tests for services, utilities, API infrastructure
 *   - "jsdom" → Component tests with React Testing Library
 *   - "e2e"   → Playwright (separate config)
 *
 * Per-file environment overrides are supported via `// @vitest-environment jsdom`
 * at the top of any test file.
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  test: {
    // Global defaults
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: [
      "node_modules",
      ".next",
      "src/**/*.e2e.test.ts", // E2E tests use Playwright
    ],

    // Default environment (overridable per file with @vitest-environment)
    environment: "node",

    // Setup files run before each test file
    setupFiles: ["./src/test/setup-node.ts", "./src/test/setup-dom.ts"],

    // Global test configuration
    testTimeout: 10_000,
    hookTimeout: 10_000,

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/index.ts", // Barrel exports
        "src/types/**",
        "src/constants/**",
        "src/**/*.d.ts",
        "src/test/**",
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },

    // Ensure cleanup between tests
    clearMocks: true,
    restoreMocks: true,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
