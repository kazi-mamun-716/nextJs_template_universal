/**
 * Unit tests for src/utils/array/sort.ts
 */
import { describe, it, expect } from "vitest";
import { sortBy, sortByFn, naturalSort } from "../sort";

describe("sortBy()", () => {
  it("sorts by a numeric key ascending", () => {
    const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
    expect(sortBy(items, "age")).toEqual([{ age: 20 }, { age: 25 }, { age: 30 }]);
  });

  it("sorts by a string key alphabetically", () => {
    const items = [{ name: "Charlie" }, { name: "Alice" }, { name: "Bob" }];
    expect(sortBy(items, "name")).toEqual([
      { name: "Alice" },
      { name: "Bob" },
      { name: "Charlie" },
    ]);
  });

  it("sorts by a numeric key descending", () => {
    const items = [{ age: 20 }, { age: 30 }, { age: 25 }];
    expect(sortBy(items, "age", "desc")).toEqual([{ age: 30 }, { age: 25 }, { age: 20 }]);
  });

  it("returns empty array for empty input", () => {
    expect(sortBy([], "id" as never)).toEqual([]);
  });

  it("does not mutate the original array", () => {
    const items = [{ age: 30 }, { age: 20 }];
    const sorted = sortBy(items, "age");
    expect(sorted).toEqual([{ age: 20 }, { age: 30 }]);
    expect(items).toEqual([{ age: 30 }, { age: 20 }]);
  });
});

describe("sortByFn()", () => {
  it("sorts by a function", () => {
    const items = ["Bob", "Alice"];
    expect(sortByFn(items, (s) => s)).toEqual(["Alice", "Bob"]);
  });

  it("sorts by derived value", () => {
    const items = ["aaa", "b", "cc"];
    expect(sortByFn(items, (s) => s.length)).toEqual(["b", "cc", "aaa"]);
  });
});

describe("naturalSort()", () => {
  it("sorts strings with natural ordering", () => {
    expect(naturalSort(["item2", "item10", "item1"])).toEqual(["item1", "item2", "item10"]);
  });
});
