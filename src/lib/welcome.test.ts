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
    expect(welcomeMessage({ prevVisit: null, today: TODAY, fromNudge: false, goal, entries: [] })).toBeNull();
    expect(welcomeMessage({ prevVisit: TODAY, today: TODAY, fromNudge: false, goal, entries: [] })).toBeNull();
  });

  it("thanks you for coming from a reminder", () => {
    expect(welcomeMessage({ prevVisit: TODAY, today: TODAY, fromNudge: true, goal, entries: [] })).toBe(
      "You came back. That's the hardest part.",
    );
  });

  it("celebrates a streak when yesterday was done", () => {
    const msg = welcomeMessage({ prevVisit: "2026-10-16", today: TODAY, fromNudge: false, goal, entries: on("2026-10-15", "2026-10-16") });
    expect(msg).toMatch(/^Welcome back\. 2 days in a row\./);
  });

  it("calls a single missed day a rest day", () => {
    const msg = welcomeMessage({ prevVisit: "2026-10-15", today: TODAY, fromNudge: false, goal, entries: on("2026-10-15") });
    expect(msg).toBe("Welcome back. Yesterday was your rest day this week, so your streak is safe.");
  });

  it("is kind after several missed days and says the shortfall is spread out", () => {
    const msg = welcomeMessage({ prevVisit: "2026-10-13", today: TODAY, fromNudge: false, goal, entries: on("2026-10-13") });
    expect(msg).toMatch(/It's been 4 days, and that's okay\. No catching up in one day: it's spread over the \d+ days left\./);
  });
});
