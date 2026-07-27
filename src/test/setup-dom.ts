/**
 * Vitest setup: jsdom environment.
 *
 * Safe to add to vitest config's `setupFiles` because all DOM-specific
 * code is guarded by `typeof window !== "undefined"` checks.
 *
 * Provides:
 *   - React Testing Library matchers (jest-dom)
 *   - IntersectionObserver mock
 *   - ResizeObserver mock
 *   - window.matchMedia mock (for next-themes, responsive hooks)
 *   - scrollTo/scrollIntoView mocks
 */

import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Only activate in jsdom environment
if (typeof window !== "undefined") {
  // ─── IntersectionObserver ───────────────────────
  class MockIntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "0px";
    readonly thresholds: ReadonlyArray<number> = [0];

    constructor(_callback: IntersectionObserverCallback) {}

    observe(_target: Element): void {}
    unobserve(): void {}
    disconnect(): void {}
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });

  // ─── ResizeObserver ────────────────────────────
  class MockResizeObserver {
    constructor(_callback: ResizeObserverCallback) {}
    observe(_target: Element): void {}
    unobserve(): void {}
    disconnect(): void {}
  }

  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: MockResizeObserver,
  });

  // ─── matchMedia ─────────────────────────────────
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches:
        query === "(prefers-color-scheme: light)" ||
        query === "(prefers-reduced-motion: no-preference)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // ─── Scroll methods ────────────────────────────
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  Element.prototype.scrollIntoView = vi.fn() as unknown as () => void;
}
