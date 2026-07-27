/**
 * Unit tests for src/utils/date/relative-time.ts
 */
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { timeAgo, timeUntil, getRelativeTime, getShortRelativeTime } from "../relative-time";

describe("timeAgo()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-27T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for recent times', () => {
    expect(timeAgo(new Date("2026-07-27T11:59:55.000Z"))).toBe("just now");
  });

  it("returns seconds ago", () => {
    const result = timeAgo(new Date("2026-07-27T11:59:30.000Z"));
    expect(result).toContain("second");
  });

  it("returns minutes ago", () => {
    const result = timeAgo(new Date("2026-07-27T11:55:00.000Z"));
    expect(result).toContain("minute");
  });

  it("returns hours ago", () => {
    const result = timeAgo(new Date("2026-07-27T10:00:00.000Z"));
    expect(result).toContain("hour");
  });

  it("returns days ago", () => {
    const result = timeAgo(new Date("2026-07-25T12:00:00.000Z"));
    expect(result).toContain("day");
  });

  it("handles string input", () => {
    const result = timeAgo("2026-07-27T11:59:30.000Z");
    expect(result).toContain("second");
  });
});

describe("timeUntil()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-27T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "in X hours" for future times', () => {
    const result = timeUntil(new Date("2026-07-27T14:00:00.000Z"));
    expect(result).toContain("in");
    expect(result).toContain("hour");
  });

  it("returns in X minutes for near future", () => {
    const result = timeUntil(new Date("2026-07-27T12:05:00.000Z"));
    expect(result).toContain("in");
    expect(result).toContain("minute");
  });
});

describe("getRelativeTime()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-27T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns past time for past dates", () => {
    const result = getRelativeTime(new Date("2026-07-27T11:00:00.000Z"));
    expect(result).toContain("ago");
  });

  it("returns future time for future dates", () => {
    const result = getRelativeTime(new Date("2026-07-27T14:00:00.000Z"));
    expect(result).toContain("in");
  });
});

describe("getShortRelativeTime()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-27T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns compact format", () => {
    const result = getShortRelativeTime(new Date("2026-07-27T10:00:00.000Z"));
    expect(result).toBe("2h ago");
  });
});
