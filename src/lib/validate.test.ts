import { describe, expect, it } from "vitest";
import { parseCount } from "./validate";

describe("parseCount", () => {
  it("accepts whole numbers with spaces around them", () => {
    expect(parseCount(" 8 ")).toEqual({ ok: true, value: 8 });
  });

  it("asks for a number when empty or not a whole number", () => {
    for (const text of ["", "abc", "2.5", "-3", "0"]) {
      expect(parseCount(text)).toEqual({ ok: false, error: "Enter a whole number, like 5." });
    }
  });

  it("caps very large numbers", () => {
    expect(parseCount("5000")).toEqual({ ok: false, error: "That's a lot! Enter a number up to 1,000." });
  });
});
