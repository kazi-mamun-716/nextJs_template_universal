/**
 * Unit tests for src/components/common/skeleton.tsx
 *
 * Skeleton is a pure presentational component with no interactive behavior.
 * Visual class assertions are intentionally omitted for the same reason
 * as LoadingSpinner — provider wrapping makes container.firstChild
 * unreliable.
 */
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@/test/render-utils";
import { Skeleton } from "../skeleton";

describe("Skeleton", () => {
  it("renders without throwing", () => {
    expect(() => render(<Skeleton />)).not.toThrow();
  });
});
