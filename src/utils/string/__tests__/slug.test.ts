/**
 * Unit tests for src/utils/string/slug.ts
 */
import { describe, it, expect } from "vitest";
import { slugify, uniqueSlug, filenameSlug } from "../slug";

describe("slugify()", () => {
  it("converts a simple string to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("converts special characters", () => {
    expect(slugify("Hello & World!")).toBe("hello-world");
  });

  it("collapses multiple spaces", () => {
    expect(slugify("Hello   World")).toBe("hello-world");
  });

  it("handles leading and trailing whitespace", () => {
    expect(slugify("  Hello World  ")).toBe("hello-world");
  });

  it("removes hyphens by default (not preserved)", () => {
    expect(slugify("hello-world")).toBe("helloworld");
  });

  it("preserves hyphens when configured", () => {
    expect(slugify("hello-world", { preserve: "-" })).toBe("hello-world");
  });

  it("handles numbers", () => {
    expect(slugify("Article 123")).toBe("article-123");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("uses custom separator", () => {
    expect(slugify("Hello World", { separator: "_" })).toBe("hello_world");
  });

  it("respects maxLength", () => {
    expect(slugify("Hello World Example", { maxLength: 12 })).toBe("hello-world");
  });
});

describe("uniqueSlug()", () => {
  it("returns base slug when not in set", () => {
    expect(uniqueSlug("hello-world", new Set(["foo", "bar"]))).toBe("hello-world");
  });

  it("appends counter when slug exists", () => {
    expect(uniqueSlug("hello-world", new Set(["hello-world"]))).toBe("hello-world-1");
  });

  it("increments counter until unique", () => {
    expect(
      uniqueSlug("hello-world", new Set(["hello-world", "hello-world-1", "hello-world-2"])),
    ).toBe("hello-world-3");
  });
});

describe("filenameSlug()", () => {
  it("converts filename to slug preserving extension", () => {
    expect(filenameSlug("My File (v2).pdf")).toBe("my-file-v2.pdf");
  });

  it("handles filename without extension", () => {
    expect(filenameSlug("My File")).toBe("my-file");
  });
});
