import { addDays, daysBetween } from "./dates";
import { formatCount } from "./format";
import { planToday } from "./quota";
import { streak } from "./streak";
import type { Entry, Goal } from "./types";

interface WelcomeInput {
  prevVisit: string | null;
  today: string;
  fromNudge: boolean;
  /** The goal shown first today. */
  goal: Goal;
  entries: Entry[];
}

function lastActiveDay(goal: Goal, entries: Entry[], today: string): string {
  const days = entries.filter((e) => e.goalId === goal.id && e.date < today).map((e) => e.date);
  return days.length > 0 ? days.reduce((a, b) => (a > b ? a : b)) : goal.startDate;
}

/** The line shown at the top when someone comes back. Null when there is nothing to say. */
export function welcomeMessage({ prevVisit, today, fromNudge, goal, entries }: WelcomeInput): string | null {
  if (fromNudge) return "You came back. That's the hardest part.";
  if (prevVisit === null || prevVisit >= today) return null;

  const plan = planToday(goal, entries, today);
  const todayLine = `Today: ${formatCount(plan.quota, goal.unit)}.`;
  const sinceActive = daysBetween(lastActiveDay(goal, entries, today), today);
  const run = streak(goal, entries, today);

  if (sinceActive <= 1) {
    return run.days > 1
      ? `Welcome back. ${run.days} days in a row. ${todayLine}`
      : `Welcome back. You showed up yesterday. ${todayLine}`;
  }
  if (sinceActive === 2) {
    return run.restDays.includes(addDays(today, -1)) && run.days > 0
      ? "Welcome back. Yesterday was your rest day this week, so your streak is safe."
      : `Welcome back. Yesterday slipped, and that's okay. Today's a fresh start. ${todayLine}`;
  }
  const spread =
    goal.type === "by-date" && plan.daysLeft
      ? `No catching up in one day: it's spread over the ${plan.daysLeft} days left.`
      : `Today's a fresh start: just ${formatCount(plan.quota, goal.unit)}.`;
  return `Welcome back. It's been ${sinceActive} days, and that's okay. ${spread}`;
}
