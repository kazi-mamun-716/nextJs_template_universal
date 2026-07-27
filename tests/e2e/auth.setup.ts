/**
 * Playwright auth setup.
 *
 * This file provides helpers for creating an authenticated browser context.
 * Tests that require authentication can use `test.use({ storageState })`
 * to load a pre-authenticated session.
 *
 * @example
 * // In an authenticated test file:
 * import { test } from "../auth.setup";
 *
 * test("access dashboard", async ({ page }) => {
 *   await page.goto("/dashboard");
 *   await expect(page.locator("text=Dashboard")).toBeVisible();
 * });
 */

import { test as base, type Page } from "@playwright/test";

// ─── Auth Helper ────────────────────────────────

/**
 * Logs in a user via the credentials provider.
 * Used in test setup to create an authenticated session.
 */
export async function loginAsUser(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in|log in/i }).click();
  // Wait for redirect to dashboard (indicates successful login)
  await page.waitForURL(/\/dashboard/, { timeout: 10_000 });
}

/**
 * Logs out the current user.
 */
export async function logout(page: Page): Promise<void> {
  // Click user menu / avatar to open dropdown
  await page.getByRole("button", { name: /avatar|profile|user/i }).click();
  await page.getByRole("button", { name: /sign out|log out/i }).click();
  await page.waitForURL(/\/login/, { timeout: 10_000 });
}

// ─── Authenticated Test Fixture ─────────────────

/**
 * Extends the base test with an authenticated fixture.
 *
 * Usage:
 * import { test } from "./auth.setup";
 *
 * test("dashboard loads", async ({ authedPage }) => {
 *   await authedPage.goto("/dashboard");
 * });
 */
export const test = base.extend<{
  authedPage: Page;
}>({
  authedPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();

    // Login using the demo seed user
    await loginAsUser(page, "admin@example.com", "Admin123!");

    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";
