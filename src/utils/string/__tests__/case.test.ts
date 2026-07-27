/**
 * Unit tests for src/utils/string/case.ts
 */
import { describe, it, expect } from "vitest";
import { camelCase, snakeCase, kebabCase, pascalCase, constantCase, titleCase } from "../case";

describe("camelCase()", () => {
  it("converts space-separated words", () => {
    expect(camelCase("hello world")).toBe("helloWorld");
  });

  it("converts kebab-case", () => {
    expect(camelCase("hello-world")).toBe("helloWorld");
  });

  it("converts snake_case", () => {
    expect(camelCase("hello_world")).toBe("helloWorld");
  });

  it("handles single word", () => {
    expect(camelCase("hello")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(camelCase("")).toBe("");
  });
});

describe("snakeCase()", () => {
  it("converts camelCase", () => {
    expect(snakeCase("helloWorld")).toBe("hello_world");
  });

  it("converts space-separated words", () => {
    expect(snakeCase("hello world")).toBe("hello_world");
  });

  it("handles single word", () => {
    expect(snakeCase("hello")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(snakeCase("")).toBe("");
  });
});

describe("kebabCase()", () => {
  it("converts camelCase", () => {
    expect(kebabCase("helloWorld")).toBe("hello-world");
  });

  it("converts snake_case", () => {
    expect(kebabCase("hello_world")).toBe("hello-world");
  });

  it("converts space-separated words", () => {
    expect(kebabCase("hello world")).toBe("hello-world");
  });

  it("handles single word", () => {
    expect(kebabCase("hello")).toBe("hello");
  });
});

describe("pascalCase()", () => {
  it("converts camelCase", () => {
    expect(pascalCase("helloWorld")).toBe("HelloWorld");
  });

  it("converts kebab-case", () => {
    expect(pascalCase("hello-world")).toBe("HelloWorld");
  });

  it("converts snake_case", () => {
    expect(pascalCase("hello_world")).toBe("HelloWorld");
  });

  it("handles single word", () => {
    expect(pascalCase("hello")).toBe("Hello");
  });

  it("handles empty string", () => {
    expect(pascalCase("")).toBe("");
  });
});

describe("constantCase()", () => {
  it("converts to CONSTANT_CASE", () => {
    expect(constantCase("hello world")).toBe("HELLO_WORLD");
  });
});

describe("titleCase()", () => {
  it("converts to Title Case", () => {
    const result = titleCase("hello world");
    expect(result).toBe("Hello World");
  });
});
