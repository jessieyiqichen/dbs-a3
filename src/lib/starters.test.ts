import { describe, expect, it } from "vitest";
import { STARTERS, goalFromStarter } from "./starters";

describe("starters", () => {
  it("offers exactly two examples", () => {
    expect(STARTERS.map((s) => s.key)).toEqual(["linkedin", "applications"]);
  });

  it("sets the LinkedIn deadline 45 days out so it is never in the past", () => {
    const g = goalFromStarter(STARTERS[0], "2026-10-17", "id-1", "2026-10-17T09:00:00.000Z");
    expect(g).toMatchObject({ type: "by-date", target: 500, deadline: "2026-12-01", startDate: "2026-10-17" });
    expect(g.link).toMatch(/^https:\/\/www\.linkedin\.com\//);
  });

  it("creates a daily applications goal", () => {
    const g = goalFromStarter(STARTERS[1], "2026-10-17", "id-2", "2026-10-17T09:00:00.000Z");
    expect(g).toMatchObject({ type: "daily", target: 10, deadline: null, unit: "applications" });
  });
});
