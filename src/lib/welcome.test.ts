import { describe, expect, it } from "vitest";
import { weekSummary, welcomeMessage } from "./welcome";
import type { Entry, Goal } from "./types";

const goal: Goal = {
  id: "g1", verb: "", title: "Send LinkedIn connection requests", unit: "connections", type: "by-date",
  target: 500, deadline: "2026-12-01", link: null, startDate: "2026-10-10", pauses: [], createdAt: "",
};
const on = (...dates: string[]): Entry[] => dates.map((date) => ({ id: date, goalId: "g1", date, amount: 11, at: "" }));
const TODAY = "2026-10-17";

describe("welcomeMessage", () => {
  it("says nothing on the very first visit or a second visit the same day", () => {
    expect(welcomeMessage({ prevVisit: null, today: TODAY, fromNudge: false, goals: [goal], entries: [] })).toBeNull();
    expect(welcomeMessage({ prevVisit: TODAY, today: TODAY, fromNudge: false, goals: [goal], entries: [] })).toBeNull();
  });

  it("thanks you for coming from a reminder", () => {
    expect(welcomeMessage({ prevVisit: TODAY, today: TODAY, fromNudge: true, goals: [goal], entries: [] })).toBe(
      "You came back! That's the hardest part~",
    );
  });

  it("celebrates a streak when yesterday was done", () => {
    const msg = welcomeMessage({ prevVisit: "2026-10-16", today: TODAY, fromNudge: false, goals: [goal], entries: on("2026-10-15", "2026-10-16") });
    expect(msg).toBe("Welcome back · 2 days in a row!");
  });

  it("calls a single missed day a rest day", () => {
    const msg = welcomeMessage({ prevVisit: "2026-10-15", today: TODAY, fromNudge: false, goals: [goal], entries: on("2026-10-15") });
    expect(msg).toBe("Welcome back · yesterday was a rest day~");
  });

  it("is kind after several missed days and says the shortfall is spread out", () => {
    const msg = welcomeMessage({ prevVisit: "2026-10-13", today: TODAY, fromNudge: false, goals: [goal], entries: on("2026-10-13") });
    expect(msg).toBe("Welcome back! It's been 4 days, and that's okay~");
  });

  it("counts the streak across goals, so switching goals keeps it", () => {
    const other: Goal = { ...goal, id: "g2" };
    const entries: Entry[] = [...on("2026-10-15"), { id: "x", goalId: "g2", date: "2026-10-16", amount: 2, at: "" }];
    const msg = welcomeMessage({ prevVisit: "2026-10-16", today: TODAY, fromNudge: false, goals: [goal, other], entries });
    expect(msg).toBe("Welcome back · 2 days in a row!");
  });
});

describe("weekSummary: the first open of a new week", () => {
  // 2026-10-19 is a Monday; Oct 12 to 18 is last week
  it("adds up last week's fish and days on the first open", () => {
    const entries = [...on("2026-10-13", "2026-10-15"), { id: "x", goalId: "g1", date: "2026-10-15", amount: 4, at: "" }];
    expect(weekSummary([goal], entries, "2026-10-19", "2026-10-18")).toBe("Last week: 26 fish for Titi over 2 days!");
  });
  it("says nothing on later opens the same week, or when last week was empty", () => {
    expect(weekSummary([goal], on("2026-10-13"), "2026-10-20", "2026-10-19")).toBeNull();
    expect(weekSummary([goal], [], "2026-10-19", "2026-10-18")).toBeNull();
    expect(weekSummary([goal], on("2026-10-13"), "2026-10-19", null)).toBeNull();
  });
});
