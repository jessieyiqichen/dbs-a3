import { describe, expect, it } from "vitest";
import { timeOfDay, todayBowl, weekBowls, weekdayLetter } from "./scene";
import type { Entry, Goal } from "./types";

const goal: Goal = { id: "g1", verb: "Send", title: "Send applications", unit: "applications", type: "daily", target: 2, deadline: null, link: null, startDate: "2026-10-05", pauses: [], createdAt: "" };
const on = (date: string, amount: number): Entry => ({ id: date + amount, goalId: "g1", date, amount, at: "" });

describe("timeOfDay", () => {
  it("is morning from 5, dusk from 16, night from 20", () => {
    expect([4, 5, 15, 16, 19, 20, 23].map(timeOfDay)).toEqual(["night", "morning", "morning", "dusk", "dusk", "night", "night"]);
  });
});

describe("todayBowl: one bowl for every goal", () => {
  it("has some fish once any goal logged, and is heaped when every goal's number is reached", () => {
    const other: Goal = { ...goal, id: "g2", target: 1 };
    const g1 = (n: number): Entry => ({ id: "a" + n, goalId: "g1", date: "2026-10-17", amount: n, at: "" });
    const g2: Entry = { id: "b", goalId: "g2", date: "2026-10-17", amount: 1, at: "" };
    expect(todayBowl([goal, other], [], "2026-10-17")).toBe("empty");
    expect(todayBowl([goal, other], [g1(2)], "2026-10-17")).toBe("some");
    expect(todayBowl([goal, other], [g1(2), g2], "2026-10-17")).toBe("full");
  });
});

describe("weekBowls: the seven bowls on the sill, Monday to Sunday", () => {
  // 2026-10-17 is a Saturday
  it("fills a bowl when a day got something, heaps it when the day's number was reached", () => {
    const bowls = weekBowls([goal], [on("2026-10-12", 2), on("2026-10-13", 1), on("2026-10-17", 2)], "2026-10-17");
    expect(bowls.map((b) => b.date)).toEqual(["2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16", "2026-10-17", "2026-10-18"]);
    expect(bowls.map((b) => b.fill)).toEqual(["full", "some", "empty", "empty", "empty", "full", "empty"]);
    expect(bowls.map((b) => b.today)).toEqual([false, false, false, false, false, true, false]);
    expect(bowls.map((b) => b.future)).toEqual([false, false, false, false, false, false, true]);
  });

  it("names the days by their first letter, with the full name for screen readers", () => {
    expect(weekdayLetter("2026-10-12")).toEqual({ letter: "M", name: "Monday" });
    expect(weekdayLetter("2026-10-18")).toEqual({ letter: "S", name: "Sunday" });
  });
});
