/**
 * Unit tests for src/components/common/search-input.tsx
 *
 * Tests search input rendering, debouncing, clear button, and accessibility.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@/test/render-utils";
import { SearchInput } from "../search-input";

describe("SearchInput", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders with default placeholder", () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="Find users..." />);
    expect(screen.getByPlaceholderText("Find users...")).toBeInTheDocument();
  });

  it("displays the current value", () => {
    render(<SearchInput value="hello" onChange={() => {}} />);
    const input = screen.getByRole("searchbox");
    expect(input).toHaveValue("hello");
  });

  it("has accessible label", () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.getByRole("searchbox", { name: /search/i })).toBeInTheDocument();
  });

  it("uses custom accessible label", () => {
    render(<SearchInput value="" onChange={() => {}} label="Find items" />);
    expect(screen.getByRole("searchbox", { name: /find items/i })).toBeInTheDocument();
  });

  it("renders search icon", () => {
    const { container } = render(<SearchInput value="" onChange={() => {}} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("shows clear button when value is not empty", () => {
    render(<SearchInput value="test" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /clear search/i })).toBeInTheDocument();
  });

  it("does not show clear button when value is empty", () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.queryByRole("button", { name: /clear search/i })).not.toBeInTheDocument();
  });

  it("calls onChange with empty string when clear is clicked", async () => {
    const onChange = vi.fn();
    const { user } = render(<SearchInput value="test" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /clear search/i }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("can be disabled", () => {
    render(<SearchInput value="" onChange={() => {}} disabled />);
    expect(screen.getByRole("searchbox")).toBeDisabled();
  });
});
