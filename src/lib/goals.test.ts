import { describe, expect, it } from "vitest";
import { goalOn, putBack, takeOut, withEdit } from "./goals";
import { emptyData } from "./storage";
import type { Entry, Goal } from "./types";

const g1: Goal = { id: "g1", verb: "Send", title: "Send applications", unit: "applications", type: "daily", target: 2, deadline: null, link: null, startDate: "2026-10-05", pauses: [], createdAt: "" };
const g2: Goal = { ...g1, id: "g2" };
const e = (goalId: string, id: string): Entry => ({ id, goalId, date: "2026-10-17", amount: 1, at: "" });

describe("removing a goal and putting it back (Undo)", () => {
  const data = { ...emptyData(), goals: [g1, g2], entries: [e("g1", "a"), e("g2", "b"), e("g1", "c")], session: { goalId: "g1", startedAt: "" } };

  it("takes the goal, its entries and its session out, and hands them back for Undo", () => {
    const { data: rest, removed } = takeOut(data, "g1");
    expect(rest.goals.map((g) => g.id)).toEqual(["g2"]);
    expect(rest.entries.map((x) => x.id)).toEqual(["b"]);
    expect(rest.session).toBeNull();
    expect(removed.goal.id).toBe("g1");
    expect(removed.entries.map((x) => x.id)).toEqual(["a", "c"]);
  });

  it("puts everything back, in its old place", () => {
    const { data: rest, removed } = takeOut(data, "g1");
    const back = putBack(rest, removed);
    expect(back.goals.map((g) => g.id)).toEqual(["g1", "g2"]);
    expect(back.entries.map((x) => x.id).sort()).toEqual(["a", "b", "c"]);
  });

  it("does not add a second copy if Undo is pressed twice", () => {
    const { data: rest, removed } = takeOut(data, "g1");
    const twice = putBack(putBack(rest, removed), removed);
    expect(twice.goals.filter((g) => g.id === "g1")).toHaveLength(1);
  });
});

describe("editing a goal keeps its past: each day is judged by the number it had then", () => {
  const daily: Goal = { id: "d", verb: "Send", title: "Send applications", unit: "applications", type: "daily", target: 2, deadline: null, link: null, startDate: "2026-10-12", pauses: [], createdAt: "" };
  const values = { verb: "Send", title: "Send applications", unit: "applications", type: "daily" as const, target: 3, deadline: null, link: null };

  it("records the old number up to yesterday when the number changes, and today uses the new one", () => {
    const edited = withEdit(daily, values, "2026-10-19");
    expect(edited.target).toBe(3);
    expect(edited.history).toEqual([{ to: "2026-10-18", target: 2, type: "daily", deadline: null }]);
    expect(goalOn(edited, "2026-10-14").target).toBe(2);
    expect(goalOn(edited, "2026-10-18").target).toBe(2);
    expect(goalOn(edited, "2026-10-19").target).toBe(3);
  });

  it("keeps the first record when edited again the same day, and adds nothing when the number stays", () => {
    const twice = withEdit(withEdit(daily, values, "2026-10-19"), { ...values, target: 4 }, "2026-10-19");
    expect(twice.history).toEqual([{ to: "2026-10-18", target: 2, type: "daily", deadline: null }]);
    expect(twice.target).toBe(4);
    expect(withEdit(daily, { ...values, target: 2, unit: "job applications" }, "2026-10-19").history ?? []).toEqual([]);
  });

  it("has no past to keep for a goal that started today", () => {
    expect(withEdit({ ...daily, startDate: "2026-10-19" }, values, "2026-10-19").history ?? []).toEqual([]);
  });
});
