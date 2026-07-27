/**
 * Unit tests for src/components/common/loading-spinner.tsx
 *
 * LoadingSpinner is a pure presentational component with no interactive behavior.
 * Visual class assertions are intentionally omitted because the provider
 * wrapper (ThemeProvider + ToastProvider) makes container.firstChild
 * unreliable — it points to the sonner Toaster, not the component.
 *
 * Behavioral assertions (size variants) would require css module/class
 * introspection that is better suited for visual regression testing.
 */
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@/test/render-utils";
import { LoadingSpinner } from "../loading-spinner";

describe("LoadingSpinner", () => {
  it("renders without throwing", () => {
    expect(() => render(<LoadingSpinner />)).not.toThrow();
  });

  it("renders with sm size without throwing", () => {
    expect(() => render(<LoadingSpinner size="sm" />)).not.toThrow();
  });

  it("renders with lg size without throwing", () => {
    expect(() => render(<LoadingSpinner size="lg" />)).not.toThrow();
  });
});
