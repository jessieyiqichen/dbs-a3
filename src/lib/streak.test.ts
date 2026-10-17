import { describe, expect, it } from "vitest";
import { streak } from "./streak";
import type { Entry, Goal } from "./types";

const goal: Goal = {
  id: "g1", title: "Apply to jobs", unit: "applications", type: "daily", target: 10, deadline: null,
  link: null, startDate: "2026-10-01", pauses: [], createdAt: "",
};
const on = (...dates: string[]): Entry[] => dates.map((date) => ({ id: date, goalId: "g1", date, amount: 1, at: "" }));

describe("streak", () => {
  // 2026-10-19 is a Monday; Oct 12–18 is the week before.
  it("counts consecutive days with at least one entry", () => {
    expect(streak(goal, on("2026-10-15", "2026-10-16", "2026-10-17"), "2026-10-17").days).toBe(3);
  });

  it("does not break because today isn't done yet", () => {
    expect(streak(goal, on("2026-10-15", "2026-10-16"), "2026-10-17").days).toBe(2);
  });

  it("forgives one missed day per week as a rest day", () => {
    const result = streak(goal, on("2026-10-14", "2026-10-15", "2026-10-17"), "2026-10-18");
    expect(result.days).toBe(3);
    expect(result.restDays).toEqual(["2026-10-16"]);
  });

  it("breaks on a second missed day in the same week (17, rest on 16, 15, then 14 breaks)", () => {
    expect(streak(goal, on("2026-10-13", "2026-10-15", "2026-10-17"), "2026-10-18").days).toBe(2);
  });

  it("skips paused days", () => {
    const paused = { ...goal, pauses: [{ from: "2026-10-15", to: "2026-10-16" }] };
    expect(streak(paused, on("2026-10-14", "2026-10-17"), "2026-10-17").days).toBe(2);
  });

  it("is zero with nothing logged", () => {
    expect(streak(goal, [], "2026-10-17").days).toBe(0);
  });
});
