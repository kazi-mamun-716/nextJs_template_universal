/**
 * Unit tests for src/utils/string/sanitize.ts
 */
import { describe, it, expect } from "vitest";
import { stripHtml, escapeHtml, normalizeWhitespace, removeNonAscii } from "../sanitize";

describe("stripHtml()", () => {
  it("removes all HTML tags", () => {
    expect(stripHtml("<p>Hello <strong>World</strong></p>")).toBe("Hello World");
  });

  it("handles plain text without HTML", () => {
    expect(stripHtml("Hello World")).toBe("Hello World");
  });

  it("handles empty string", () => {
    expect(stripHtml("")).toBe("");
  });
});

describe("escapeHtml()", () => {
  it("escapes < and >", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes &", () => {
    expect(escapeHtml("A & B")).toBe("A &amp; B");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('He said "hello"')).toBe("He said &quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("It's nice")).toBe("It&#x27;s nice");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("handles string with no special characters", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });
});

describe("normalizeWhitespace()", () => {
  it("trims and normalizes whitespace", () => {
    expect(normalizeWhitespace("  Hello   World  ")).toBe("Hello World");
  });
});

describe("removeNonAscii()", () => {
  it("removes non-ASCII characters", () => {
    expect(removeNonAscii("Hello™")).toBe("Hello");
  });
});
