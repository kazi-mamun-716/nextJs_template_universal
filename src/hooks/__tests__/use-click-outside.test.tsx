/**
 * Unit tests for src/hooks/use-click-outside.ts
 *
 * Tests the click outside detection behavior.
 * Hook signature: useClickOutside<T extends HTMLElement>(handler: () => void)
 * Returns: React.RefObject<T>
 */
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/render-utils";
import { useClickOutside } from "../use-click-outside";

// ─── Test Component ──────────────────────────

function TestComponent({ onOutsideClick }: { onOutsideClick: () => void }) {
  const ref = useClickOutside<HTMLDivElement>(onOutsideClick);

  return (
    <div>
      <div ref={ref} data-testid="inside">
        Inside
      </div>
      <div data-testid="outside">Outside</div>
    </div>
  );
}

// ─── Tests ───────────────────────────────────

describe("useClickOutside", () => {
  it("calls handler when clicking outside the element", () => {
    const handler = vi.fn();
    render(<TestComponent onOutsideClick={handler} />);

    // Hook listens on mousedown and touchstart
    screen.getByTestId("outside").dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not call handler when clicking inside the element", () => {
    const handler = vi.fn();
    render(<TestComponent onOutsideClick={handler} />);

    screen.getByTestId("inside").dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
  });
});
