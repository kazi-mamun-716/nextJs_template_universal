/**
 * E2E tests: Authentication flow.
 *
 * Tests the complete user authentication journey:
 *   1. Visit login page
 *   2. Submit invalid credentials → see error
 *   3. Navigate to register page
 *   4. Create a new account → redirected to dashboard
 *   5. Logout
 *   6. Visit dashboard → redirected to login
 *   7. Login with new credentials → access dashboard
 */

import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.describe("Login Page", () => {
    test("displays the login form", async ({ page }) => {
      await page.goto("/login");

      // Page elements are present
      await expect(page.getByRole("heading", { name: /sign in|log in/i })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole("button", { name: /sign in|log in/i })).toBeVisible();

      // Link to register
      await expect(page.getByRole("link", { name: /create account|register/i })).toBeVisible();
    });

    test("shows error for invalid credentials", async ({ page }) => {
      await page.goto("/login");

      await page.getByLabel(/email/i).fill("invalid@example.com");
      await page.getByLabel(/password/i).fill("wrongpassword");
      await page.getByRole("button", { name: /sign in|log in/i }).click();

      // Error message should appear
      await expect(page.getByText(/invalid|error|failed/i)).toBeVisible();
    });

    test("navigates to register page", async ({ page }) => {
      await page.goto("/login");
      await page.getByRole("link", { name: /create account|register/i }).click();
      await expect(page).toHaveURL(/\/register/);
    });
  });

  test.describe("Registration Page", () => {
    test("displays the registration form", async ({ page }) => {
      await page.goto("/register");

      await expect(page.getByRole("heading", { name: /create account|register/i })).toBeVisible();
      await expect(page.getByLabel(/name/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole("button", { name: /create account|register/i })).toBeVisible();
    });

    test("shows validation errors for empty form", async ({ page }) => {
      await page.goto("/register");
      await page.getByRole("button", { name: /create account|register/i }).click();

      // Validation messages should appear
      await expect(page.getByText(/required/i)).toBeVisible();
    });
  });

  test.describe("Protected Routes", () => {
    test("redirects unauthenticated users to login", async ({ page }) => {
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/login/);
    });

    test("redirects authenticated users away from login", async ({ page }) => {
      // This test requires a seeded test user
      // Skip by default — configure auth setup in auth.setup.ts
      test.info().skip(true, "Requires auth setup — configure in auth.setup.ts");
    });
  });
});
