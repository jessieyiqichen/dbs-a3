import type { AppData, Entry, Goal } from "./types";

/** A removed goal with everything that belonged to it, kept aside so Undo can put it back. */
export interface Removed {
  goal: Goal;
  index: number;
  entries: Entry[];
}

export function takeOut(data: AppData, id: string): { data: AppData; removed: Removed } {
  const index = data.goals.findIndex((g) => g.id === id);
  const goal = data.goals[index];
  const removed = { goal, index, entries: data.entries.filter((e) => e.goalId === id) };
  return {
    data: {
      ...data,
      goals: data.goals.filter((g) => g.id !== id),
      entries: data.entries.filter((e) => e.goalId !== id),
      session: data.session?.goalId === id ? null : data.session,
    },
    removed,
  };
}

export function putBack(data: AppData, removed: Removed): AppData {
  if (data.goals.some((g) => g.id === removed.goal.id)) return data;
  const goals = [...data.goals];
  goals.splice(Math.min(removed.index, goals.length), 0, removed.goal);
  return { ...data, goals, entries: [...data.entries, ...removed.entries] };
}
