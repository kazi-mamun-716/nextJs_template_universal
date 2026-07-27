/**
 * Unit tests for src/utils/array/unique.ts
 */
import { describe, it, expect } from "vitest";
import { unique, uniqueBy, uniqueByFn } from "../unique";

describe("unique()", () => {
  it("removes duplicate numbers", () => {
    expect(unique([1, 2, 2, 3, 1, 3])).toEqual([1, 2, 3]);
  });

  it("removes duplicate strings", () => {
    expect(unique(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
  });

  it("returns empty array for empty input", () => {
    expect(unique([])).toEqual([]);
  });

  it("returns same array when no duplicates", () => {
    expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
  });
});

describe("uniqueBy()", () => {
  it("removes duplicates by a key name", () => {
    const items = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 1, name: "Alice Dup" },
    ];
    expect(uniqueBy(items, "id")).toEqual([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(uniqueBy([], "id" as never)).toEqual([]);
  });
});

describe("uniqueByFn()", () => {
  it("removes duplicates by a function", () => {
    const items = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 1, name: "Alice Dup" },
    ];
    expect(uniqueByFn(items, (item) => item.id)).toEqual([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
  });
});
