import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrast, ratio } from "./contrast";
import { COLOR, COLOR_ROLES } from "./tokens";

const css = readFileSync(join(__dirname, "../app/globals.css"), "utf8");

describe("design system tokens", () => {
  it("match the colours in globals.css", () => {
    for (const hex of Object.values(COLOR)) expect(css, hex).toContain(hex);
  });

  it("every text pair passes WCAG AA (4.5:1), the border passes 3:1", () => {
    for (const r of COLOR_ROLES) {
      for (const [what, fg, bg] of r.checks) {
        const need = r.role === "Border" ? 3 : 4.5;
        expect(contrast(fg, bg), `${r.role} ${what}`).toBeGreaterThanOrEqual(need);
      }
    }
  });

  it("formats a ratio the way the page shows it, rounding down", () => {
    expect(ratio("#000000", "#ffffff")).toBe("21.0:1");
    expect(() => contrast("red", "#ffffff")).toThrow();
  });
});
