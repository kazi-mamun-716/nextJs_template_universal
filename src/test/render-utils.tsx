/**
 * Test render utilities.
 *
 * Provides custom render functions that wrap components with
 * necessary providers (Theme, Session, Toast, etc.) for component tests.
 *
 * Usage:
 * @example
 * // MyComponent.test.tsx
 * // @vitest-environment jsdom
 * import { render, screen } from "@/test/render-utils";
 * import { MyComponent } from "./my-component";
 *
 * it("renders correctly", () => {
 *   render(<MyComponent />);
 *   expect(screen.getByText("Hello")).toBeInTheDocument();
 * });
 */

import React, { type ReactElement } from "react";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/providers/toast-provider";

// ─── Test Provider Props ───────────────────────

interface TestProviderProps {
  children: React.ReactNode;
  /** Override the default theme */
  theme?: "light" | "dark";
  /** Provide a mock session for auth-dependent components */
  session?: unknown;
}

// ─── Test Providers ────────────────────────────

/**
 * Wraps children with all necessary providers for testing.
 * Mimics the app's provider hierarchy (from providers/index.tsx).
 *
 * NOTE: SessionProvider is intentionally omitted because it requires
 * a next-auth Session context that must be mocked at the test level.
 * Tests that need auth should wrap with SessionProvider manually.
 *
 * NOTE: ConfirmProvider and LoadingProvider are omitted because they
 * are optional UI overlays that don't affect component rendering.
 * Add them if your test depends on confirm/loading context.
 *
 * NOTE: ToastProvider is placed AFTER children so that container.firstChild
 * in tests points to the component under test, not the sonner Toaster element.
 * This allows reliable querySelector-based assertions on the component root.
 */
function TestProviders({ children }: TestProviderProps): ReactElement {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
      <ToastProvider />
    </ThemeProvider>
  );
}

// ─── Custom Render ─────────────────────────────

/**
 * Custom render function that wraps the UI with all necessary providers.
 *
 * @param ui - The component to render
 * @param options - Additional render options (can include provider overrides)
 * @returns RenderResult with additional helpers
 *
 * @example
 * const { user } = render(<MyForm />);
 * await user.type(screen.getByLabelText("Name"), "John");
 * await user.click(screen.getByRole("button", { name: "Submit" }));
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { theme?: "light" | "dark" },
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestProviders theme={options?.theme}>{children}</TestProviders>
  );

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}

// ─── Re-exports ─────────────────────────────────

/**
 * Re-export Testing Library utilities for convenience.
 * Tests can import everything from a single module:
 *
 * @example
 * import { render, screen, waitFor } from "@/test/render-utils";
 */
export { screen, waitFor, act, fireEvent, within } from "@testing-library/react";
export type { RenderResult } from "@testing-library/react";
export { customRender as render };
export default customRender;
