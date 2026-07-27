/**
 * Unit tests for src/utils/array/chunk.ts
 */
import { describe, it, expect } from "vitest";
import { chunk } from "../chunk";

describe("chunk()", () => {
  it("splits array into chunks of given size", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("handles exact division", () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(chunk([], 2)).toEqual([]);
  });

  it("returns single chunk when size is larger than array length", () => {
    expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
  });

  it("handles size of 1", () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });

  it("handles single element array", () => {
    expect(chunk([1], 3)).toEqual([[1]]);
  });
});
