/**
 * Unit tests for src/utils/number/format.ts
 */
import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatOrdinal,
  formatCompact,
  formatFixed,
  roundTo,
} from "../format";

describe("formatNumber()", () => {
  it("formats an integer with commas", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("handles zero", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("handles negative numbers", () => {
    expect(formatNumber(-1234)).toBe("-1,234");
  });
});

describe("formatCurrency()", () => {
  it("formats a number as USD by default", () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain("1,234.56");
  });

  it("handles zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0.00");
  });
});

describe("formatPercent()", () => {
  it("formats a decimal as percentage", () => {
    expect(formatPercent(0.25)).toBe("25.0%");
  });

  it("handles whole numbers", () => {
    expect(formatPercent(1)).toBe("100.0%");
  });

  it("handles zero", () => {
    expect(formatPercent(0)).toBe("0.0%");
  });

  it("uses custom decimal places", () => {
    expect(formatPercent(0.3333, 1)).toBe("33.3%");
  });
});

describe("formatOrdinal()", () => {
  it("formats 1st", () => {
    expect(formatOrdinal(1)).toBe("1st");
  });

  it("formats 2nd", () => {
    expect(formatOrdinal(2)).toBe("2nd");
  });

  it("formats 3rd", () => {
    expect(formatOrdinal(3)).toBe("3rd");
  });

  it("formats 4th", () => {
    expect(formatOrdinal(4)).toBe("4th");
  });

  it("formats 11th (teen exception)", () => {
    expect(formatOrdinal(11)).toBe("11th");
  });

  it("formats 12th (teen exception)", () => {
    expect(formatOrdinal(12)).toBe("12th");
  });

  it("formats 13th (teen exception)", () => {
    expect(formatOrdinal(13)).toBe("13th");
  });

  it("formats 21st", () => {
    expect(formatOrdinal(21)).toBe("21st");
  });
});

describe("formatCompact()", () => {
  it("formats thousands", () => {
    expect(formatCompact(1500)).toBe("1.5K");
  });
});

describe("formatFixed()", () => {
  it("formats to fixed decimal places", () => {
    expect(formatFixed(3.14159, 2)).toBe("3.14");
  });
});

describe("roundTo()", () => {
  it("rounds to specified precision", () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
  });
});
