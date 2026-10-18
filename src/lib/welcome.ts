import { addDays, daysBetween } from "./dates";
import { overallStreak } from "./streak";
import type { Entry, Goal } from "./types";

interface WelcomeInput {
  prevVisit: string | null;
  today: string;
  fromNudge: boolean;
  /** Every goal: the streak and the last active day are for the whole app, like the streak chip. */
  goals: Goal[];
  entries: Entry[];
}

function lastActiveDay(goals: Goal[], entries: Entry[], today: string): string {
  const ids = new Set(goals.map((g) => g.id));
  const days = entries.filter((e) => ids.has(e.goalId) && e.date < today).map((e) => e.date);
  const firstStart = goals.map((g) => g.startDate).sort()[0] ?? today;
  return days.length > 0 ? days.reduce((a, b) => (a > b ? a : b)) : firstStart;
}

/** The line shown at the top when someone comes back. Null when there is nothing to say. */
export function welcomeMessage({ prevVisit, today, fromNudge, goals, entries }: WelcomeInput): string | null {
  if (fromNudge) return "You came back! That's the hardest part~";
  if (prevVisit === null || prevVisit >= today) return null;

  const sinceActive = daysBetween(lastActiveDay(goals, entries, today), today);
  const run = overallStreak(goals, entries, today);

  // Short: the headline below already says what to do today.
  if (sinceActive <= 1) return run.days > 1 ? `Welcome back · ${run.days} days in a row!` : "Welcome back · yesterday counted!";
  if (sinceActive === 2) {
    return run.restDays.includes(addDays(today, -1)) && run.days > 0
      ? "Welcome back · yesterday was a rest day~"
      : "Welcome back! Fresh start today~";
  }
  return `Welcome back! It's been ${sinceActive} days, and that's okay~`;
}
