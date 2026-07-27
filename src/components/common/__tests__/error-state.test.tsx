/**
 * Unit tests for src/components/common/error-state.tsx
 *
 * Tests the ErrorState component rendering with title, message,
 * and retry button interaction.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/render-utils";
import { ErrorState } from "../error-state";

describe("ErrorState", () => {
  it("renders default title when not provided", () => {
    render(<ErrorState />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders custom title when provided", () => {
    render(<ErrorState title="Custom error" />);
    expect(screen.getByText("Custom error")).toBeInTheDocument();
  });

  it("renders message when provided", () => {
    render(<ErrorState message="An unexpected error occurred." />);
    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", () => {
    render(<ErrorState onRetry={() => {}} />);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<ErrorState />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const onRetry = vi.fn();
    const { user } = render(<ErrorState onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
