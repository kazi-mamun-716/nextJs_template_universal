/**
 * Unit tests for src/utils/string/truncate.ts
 */
import { describe, it, expect } from "vitest";
import { truncate, truncateChars, truncateWords } from "../truncate";

describe("truncate()", () => {
  it("returns the full string when shorter than maxLength", () => {
    expect(truncate("Hello", { maxLength: 10 })).toBe("Hello");
  });

  it("returns the full string when equal to maxLength", () => {
    expect(truncate("Hello", { maxLength: 5 })).toBe("Hello");
  });

  it("truncates and appends ellipsis when longer than maxLength", () => {
    expect(truncate("Hello World", { maxLength: 8 })).toBe("Hello...");
  });

  it("supports middle truncation", () => {
    // charsToShow = 8 - 3 = 5, frontChars = ceil(5/2) = 3, backChars = floor(5/2) = 2
    expect(truncate("Hello World", { maxLength: 8, position: "middle" })).toBe("Hel...ld");
  });

  it("uses custom suffix when provided", () => {
    expect(truncate("Hello World", { maxLength: 8, ellipsis: "---" })).toBe("Hello---");
  });

  it("handles empty string", () => {
    expect(truncate("", { maxLength: 5 })).toBe("");
  });

  it("truncates at word boundary when specified", () => {
    expect(truncate("Hello beautiful world", { maxLength: 12, wordBoundary: true })).toBe(
      "Hello...",
    );
  });
});

describe("truncateChars()", () => {
  it("truncates by character count with defaults", () => {
    expect(truncateChars("Hello World", 5)).toBe("He...");
  });

  it("uses custom ellipsis", () => {
    expect(truncateChars("Hello World", 5, "..")).toBe("Hel..");
  });
});

describe("truncateWords()", () => {
  it("truncates at word count", () => {
    expect(truncateWords("Hello beautiful world", 2)).toBe("Hello beautiful...");
  });

  it("returns full text when within word count", () => {
    expect(truncateWords("Hello world", 5)).toBe("Hello world");
  });
});
