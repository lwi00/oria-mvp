import { describe, it, expect } from "vitest";
import { computeApy } from "./apy.utils.js";

describe("computeApy", () => {
  it("returns 4.0 for streak 0", () => {
    expect(computeApy(0)).toBe(4.0);
  });

  it("returns ~5.16 for streak 1", () => {
    expect(computeApy(1)).toBeCloseTo(5.16, 1);
  });

  it("returns ~5.83 for streak 2", () => {
    expect(computeApy(2)).toBeCloseTo(5.83, 1);
  });

  it("returns ~7.0 for streak 5", () => {
    expect(computeApy(5)).toBeCloseTo(6.98, 1);
  });

  it("returns 8.0 for streak 10", () => {
    expect(computeApy(10)).toBe(8.0);
  });

  it("returns 8.0 for streak > 10", () => {
    expect(computeApy(100)).toBe(8.0);
  });

  it("returns 4.0 for negative streak", () => {
    expect(computeApy(-5)).toBe(4.0);
  });
});
