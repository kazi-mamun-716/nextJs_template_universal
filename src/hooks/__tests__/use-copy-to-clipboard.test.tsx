/**
 * Unit tests for src/hooks/use-copy-to-clipboard.ts
 *
 * Tests clipboard copy functionality.
 * In jsdom, navigator.clipboard is not available and document.execCommand
 * is not defined, so the hook's try block fails and the catch block
 * runs document.execCommand which also fails. We test that the hook
 * handles both failures gracefully and still sets copied to true
 * (the execCommand call doesn't throw, it just silently succeeds in jsdom).
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/render-utils";
import { useCopyToClipboard } from "../use-copy-to-clipboard";

// ─── Mock execCommand ────────────────────────
// jsdom does not define document.execCommand, so we add it as a mock.
// vi.spyOn would fail because the property doesn't exist.
Object.defineProperty(document, "execCommand", {
  value: vi.fn().mockReturnValue(true),
  writable: true,
  configurable: true,
});

// ─── Test Component ──────────────────────────

function TestComponent({ textToCopy }: { textToCopy: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <div>
      <span data-testid="copied">{String(copied)}</span>
      <button onClick={() => copy(textToCopy)}>Copy</button>
    </div>
  );
}

// ─── Tests ───────────────────────────────────

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with copied as false", () => {
    render(<TestComponent textToCopy="hello" />);
    expect(screen.getByTestId("copied")).toHaveTextContent("false");
  });

  it("sets copied to true after copy (via execCommand fallback in jsdom)", async () => {
    const { user } = render(<TestComponent textToCopy="hello" />);
    await user.click(screen.getByRole("button", { name: /copy/i }));

    // In jsdom, clipboard is not available, so the hook falls back to
    // document.execCommand('copy'), which succeeds via our mock
    expect(screen.getByTestId("copied")).toHaveTextContent("true");
  });
});
