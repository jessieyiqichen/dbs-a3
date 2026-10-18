import { describe, expect, it } from "vitest";
import { bowlFill, doneStats, sessionLine } from "./session";
import type { Goal } from "./types";

const FULL_STOP = /\.(\s|$)/;

describe("sessionLine: what Titi says while you work", () => {
  it("greets, counts, and gets excited near the end", () => {
    expect(sessionLine(0, 5)).toBe("Ready when you are~");
    expect(sessionLine(1, 5)).toBe("First one down!");
    expect(sessionLine(2, 5)).toBe("2 down, 3 to go!");
    expect(sessionLine(4, 5)).toBe("One more and Titi is full!");
  });

  it("never uses a full stop", () => {
    for (let done = 0; done <= 6; done++) expect(sessionLine(done, 6)).not.toMatch(FULL_STOP);
  });
});

describe("bowlFill", () => {
  it("shows an empty, half or full bowl by how far today has come", () => {
    expect(bowlFill(0, 5)).toBe("empty");
    expect(bowlFill(1, 5)).toBe("some");
    expect(bowlFill(3, 5)).toBe("some");
    expect(bowlFill(5, 5)).toBe("full");
    expect(bowlFill(1, 1)).toBe("full");
  });
});

describe("doneStats: the three cards on the done screen", () => {
  const byDate: Goal = { id: "g", verb: "Send", title: "Send connection requests", unit: "connection requests", type: "by-date", target: 150, deadline: "2026-11-17", link: null, startDate: "2026-10-10", pauses: [], createdAt: "" };
  const daily: Goal = { ...byDate, type: "daily", target: 3, deadline: null };

  it("shows the road for a by-date goal as a percentage", () => {
    expect(doneStats(byDate, { doneToday: 5, doneTotal: 56, streakDays: 4 })).toEqual([
      { label: "Fish today", value: 5, suffix: "" },
      { label: "Streak", value: 4, suffix: " days" },
      { label: "Road to 150", value: 37, suffix: "%" },
    ]);
  });

  it("shows the all-time total for a daily goal", () => {
    expect(doneStats(daily, { doneToday: 3, doneTotal: 21, streakDays: 1 })[2]).toEqual({ label: "All time", value: 21, suffix: "" });
    expect(doneStats(daily, { doneToday: 3, doneTotal: 21, streakDays: 1 })[1]).toEqual({ label: "Streak", value: 1, suffix: " day" });
  });
});
