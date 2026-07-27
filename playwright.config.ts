/**
 * Playwright E2E test configuration.
 *
 * End-to-end tests simulate real user flows in a headless browser.
 * Tests are located in `tests/e2e/` and use the `.e2e.ts` extension.
 *
 * @example
 * // Run all E2E tests
 * npx playwright test
 *
 * // Run with UI mode
 * npx playwright test --ui
 *
 * // Run a specific test file
 * npx playwright test login
 */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["html"], ["github"]] : [["html"], ["list"]],

  // Shared timeout for each test
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },

  // Use the app's preview server
  webServer: {
    command: "npm run build && npm run start",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    // Mobile viewports
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 13"] },
    },
  ],
});
