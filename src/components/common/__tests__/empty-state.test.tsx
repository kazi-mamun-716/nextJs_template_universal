/**
 * Unit tests for src/components/common/empty-state.tsx
 *
 * Tests empty state rendering with title, description, action,
 * and custom icon support.
 */
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/render-utils";
import { EmptyState } from "../empty-state";

describe("EmptyState", () => {
  it("renders the title", () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<EmptyState title="No data" description="Try adjusting your filters." />);
    expect(screen.getByText("Try adjusting your filters.")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<EmptyState title="No data" />);
    expect(screen.queryByText("Try adjusting your filters.")).not.toBeInTheDocument();
  });

  it("renders action button when provided", () => {
    render(<EmptyState title="No items" action={<button>Create new</button>} />);
    expect(screen.getByRole("button", { name: /create new/i })).toBeInTheDocument();
  });

  it("does not render action when not provided", () => {
    render(<EmptyState title="No items" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders custom icon when provided", () => {
    render(<EmptyState title="Empty" icon={<span data-testid="custom-icon">📦</span>} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders default Inbox icon when no icon provided", () => {
    const { container } = render(<EmptyState title="Empty" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders title as h3 element", () => {
    render(<EmptyState title="Section title" />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Section title");
  });
});
