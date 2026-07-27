/**
 * Unit tests for src/utils/array/group-by.ts
 */
import { describe, it, expect } from "vitest";
import { groupBy, groupByFn } from "../group-by";

describe("groupBy()", () => {
  it("groups items by a string key", () => {
    const items = [
      { category: "fruit", name: "apple" },
      { category: "fruit", name: "banana" },
      { category: "veggie", name: "carrot" },
    ];
    expect(groupBy(items, "category")).toEqual({
      fruit: [
        { category: "fruit", name: "apple" },
        { category: "fruit", name: "banana" },
      ],
      veggie: [{ category: "veggie", name: "carrot" }],
    });
  });

  it("returns empty object for empty array", () => {
    expect(groupBy([], "key" as never)).toEqual({});
  });

  it("groups single item", () => {
    const items = [{ type: "single", value: 1 }];
    expect(groupBy(items, "type")).toEqual({
      single: [{ type: "single", value: 1 }],
    });
  });
});

describe("groupByFn()", () => {
  it("groups items by a function", () => {
    const items = [
      { name: "apple", category: "fruit" },
      { name: "carrot", category: "veggie" },
    ];
    const result = groupByFn(items, (item) => item.category);
    expect(result.fruit).toHaveLength(1);
    expect(result.veggie).toHaveLength(1);
  });
});
