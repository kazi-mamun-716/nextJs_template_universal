/**
 * Unit tests for src/hooks/use-debounce.ts
 *
 * Tests the debounce hook's value update timing.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@/test/render-utils";
import { useDebounce } from "../use-debounce";

// ─── Test Component ──────────────────────────

function TestComponent({ value, delay }: { value: string; delay: number }) {
  const debouncedValue = useDebounce(value, delay);
  return <div data-testid="output">{debouncedValue}</div>;
}

// ─── Tests ───────────────────────────────────

describe("useDebounce", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value immediately", () => {
    render(<TestComponent value="hello" delay={500} />);
    expect(screen.getByTestId("output")).toHaveTextContent("hello");
  });

  it("does not update before delay elapses", () => {
    vi.useFakeTimers();
    const { rerender } = render(<TestComponent value="hello" delay={500} />);

    rerender(<TestComponent value="world" delay={500} />);
    expect(screen.getByTestId("output")).toHaveTextContent("hello");
  });

  it("updates after delay elapses", () => {
    vi.useFakeTimers();
    const { rerender } = render(<TestComponent value="hello" delay={500} />);

    rerender(<TestComponent value="world" delay={500} />);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByTestId("output")).toHaveTextContent("world");
  });

  it("cancels previous timer on new value", () => {
    vi.useFakeTimers();
    const { rerender } = render(<TestComponent value="hello" delay={500} />);

    rerender(<TestComponent value="world" delay={500} />);
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Change value again while timer is pending
    rerender(<TestComponent value="final" delay={500} />);

    // Advance past first delay - value should NOT be "world"
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.getByTestId("output")).not.toHaveTextContent("world");

    // Advance to final delay
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByTestId("output")).toHaveTextContent("final");
  });

  it("handles delay of 0", () => {
    vi.useFakeTimers();
    const { rerender } = render(<TestComponent value="hello" delay={0} />);

    rerender(<TestComponent value="world" delay={0} />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByTestId("output")).toHaveTextContent("world");
  });
});
