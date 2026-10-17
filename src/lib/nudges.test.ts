import { describe, expect, it } from "vitest";
import { calendarLine, levelFor, nudgeLine } from "./nudges";
import { planToday } from "./quota";
import type { Entry, Goal } from "./types";

const goal: Goal = {
  id: "g1", verb: "", title: "Send LinkedIn connection requests", unit: "connections", type: "by-date",
  target: 500, deadline: "2026-12-01", link: null, startDate: "2026-10-17", pauses: [],
  createdAt: "2026-10-17T09:00:00.000Z",
};
const entry = (date: string, amount: number): Entry => ({ id: "e", goalId: "g1", date, amount, at: "" });

describe("levelFor", () => {
  it("gets firmer through the day", () => {
    expect(levelFor(9)).toBe("gentle");
    expect(levelFor(14)).toBe("firmer");
    expect(levelFor(19)).toBe("last-call");
  });
});

describe("nudgeLine", () => {
  const today = "2026-10-17";

  it("uses a different line on consecutive days", () => {
    const plan = planToday(goal, [], today);
    const a = nudgeLine(goal, plan, today, 9);
    const b = nudgeLine(goal, plan, "2026-10-18", 9);
    expect(a).not.toBe(b);
  });

  it("is the same line all day for the same level", () => {
    const plan = planToday(goal, [], today);
    expect(nudgeLine(goal, plan, today, 9)).toBe(nudgeLine(goal, plan, today, 11));
  });

  it("changes tone as the day goes on when nothing is done", () => {
    const plan = planToday(goal, [], today);
    expect(nudgeLine(goal, plan, today, 9)).not.toBe(nudgeLine(goal, plan, today, 21));
  });

  it("encourages once started, without repeating the numbers the headline shows", () => {
    const plan = planToday(goal, [entry(today, 4)], today);
    const line = nudgeLine(goal, plan, today, 21);
    expect(line).not.toMatch(/\d/);
    expect(line).not.toMatch(/zero|late/i);
  });

  it("celebrates a finished day", () => {
    const plan = planToday(goal, [entry(today, 11)], today);
    expect(nudgeLine(goal, plan, today, 21)).not.toMatch(/zero|late/i);
  });

  it("never uses shaming words", () => {
    const lines = [9, 15, 21].flatMap((h) =>
      ["2026-10-17", "2026-10-18", "2026-10-19", "2026-10-20"].map((d) => nudgeLine(goal, planToday(goal, [], d), d, h)),
    );
    lines.forEach((line) => expect(line).not.toMatch(/lazy|fail|should have|shame|again\?/i));
  });
});

describe("length", () => {
  const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

  it("keeps every nudge to eight words or fewer", () => {
    const days = ["2026-10-17", "2026-10-18", "2026-10-19", "2026-10-20"];
    const plans = [
      planToday(goal, [], "2026-10-17"),
      planToday(goal, [entry("2026-10-17", 4)], "2026-10-17"),
      planToday(goal, [entry("2026-10-17", 11)], "2026-10-17"),
    ];
    for (const d of days) for (const h of [9, 15, 21]) for (const p of plans) {
      expect(words(nudgeLine(goal, p, d, h))).toBeLessThanOrEqual(8);
      expect(words(calendarLine(d, h))).toBeLessThanOrEqual(8);
    }
  });
});
