import { describe, expect, it } from "vitest";
import { putBack, takeOut } from "./goals";
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
