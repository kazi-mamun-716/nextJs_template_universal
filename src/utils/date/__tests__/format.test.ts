/**
 * Unit tests for src/utils/date/format.ts
 */
import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatDateTime,
  formatDateISO,
  formatTime,
  isToday,
  isBefore,
  isAfter,
} from "../format";

describe("formatDate()", () => {
  it("formats a date string", () => {
    const result = formatDate("2026-01-15");
    expect(typeof result).toBe("string");
    expect(result).toBeTruthy();
  });

  it("formats a Date object", () => {
    const result = formatDate(new Date("2026-01-15"));
    expect(typeof result).toBe("string");
    expect(result).toBeTruthy();
  });

  it("formats a timestamp", () => {
    const result = formatDate(1768521600000); // 2026-01-15
    expect(typeof result).toBe("string");
    expect(result).toBeTruthy();
  });
});

describe("formatDateISO()", () => {
  it("formats as YYYY-MM-DD", () => {
    expect(formatDateISO("2026-01-15")).toBe("2026-01-15");
  });
});

describe("formatTime()", () => {
  it("formats time", () => {
    const result = formatTime("2026-01-15T14:30:00");
    expect(typeof result).toBe("string");
    expect(result).toBeTruthy();
  });
});

describe("formatDateTime()", () => {
  it("formats date and time", () => {
    const result = formatDateTime("2026-01-15T14:30:00");
    expect(typeof result).toBe("string");
    expect(result).toBeTruthy();
  });
});

describe("isToday()", () => {
  it("returns true for current date", () => {
    expect(isToday(new Date())).toBe(true);
  });

  it("returns false for past date", () => {
    expect(isToday("2020-01-01")).toBe(false);
  });
});

describe("isBefore()", () => {
  it("returns true when first date is before second", () => {
    expect(isBefore("2024-01-01", "2024-06-01")).toBe(true);
  });

  it("returns false when first date is after second", () => {
    expect(isBefore("2024-06-01", "2024-01-01")).toBe(false);
  });
});

describe("isAfter()", () => {
  it("returns true when first date is after second", () => {
    expect(isAfter("2024-06-01", "2024-01-01")).toBe(true);
  });
});
