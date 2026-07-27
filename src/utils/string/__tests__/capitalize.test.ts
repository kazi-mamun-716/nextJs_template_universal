/**
 * Unit tests for src/utils/string/capitalize.ts
 */
import { describe, it, expect } from "vitest";
import { capitalize, capitalizeWords, uncapitalize } from "../capitalize";

describe("capitalize()", () => {
  it("capitalizes the first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("preserves the case of remaining characters", () => {
    expect(capitalize("hELLO")).toBe("HELLO");
  });

  it("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("handles single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("handles already capitalized string", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  it("capitalizes only the first letter of a phrase", () => {
    expect(capitalize("hello world")).toBe("Hello world");
  });
});

describe("capitalizeWords()", () => {
  it("capitalizes the first letter of each word", () => {
    expect(capitalizeWords("hello world")).toBe("Hello World");
  });
});

describe("uncapitalize()", () => {
  it("lowercases the first letter", () => {
    expect(uncapitalize("Hello")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(uncapitalize("")).toBe("");
  });
});
