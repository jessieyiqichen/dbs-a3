import { describe, expect, it } from "vitest";
import { welcomeMessage } from "./welcome";
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
