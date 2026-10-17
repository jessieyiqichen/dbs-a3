import { addDays, weekKey } from "./dates";
import { isPaused } from "./quota";
import type { Entry, Goal } from "./types";

export interface Streak {
  days: number;
  /** Missed days forgiven as the week's one rest day. */
  restDays: string[];
}

/**
 * Consecutive days with at least one entry. Today only counts once something is logged,
 * paused days are skipped, and the first missed day in each week is a rest day.
 */
export function streak(goal: Goal, entries: Entry[], today: string): Streak {
  const active = new Set(entries.filter((e) => e.goalId === goal.id && e.amount > 0).map((e) => e.date));
  const restWeeks = new Set<string>();
  const restDays: string[] = [];
  let days = 0;

  for (let d = active.has(today) ? today : addDays(today, -1); d >= goal.startDate; d = addDays(d, -1)) {
    if (active.has(d)) {
      days += 1;
    } else if (!isPaused(goal, d)) {
      const week = weekKey(d);
      if (restWeeks.has(week)) break;
      restWeeks.add(week);
      restDays.push(d);
    }
  }
  return { days, restDays };
}
