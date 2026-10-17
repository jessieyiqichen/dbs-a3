import { daysBetween, formatShortDate } from "./dates";
import { formatCount } from "./format";
import type { TodayPlan } from "./quota";
import type { Goal } from "./types";

export type NudgeLevel = "gentle" | "firmer" | "last-call";

/** Warm and motivating, never shaming, eight words at most. Lines rotate by day. */
const NOT_STARTED: Record<NudgeLevel, string[]> = {
  gentle: [
    "One is enough to start.",
    "Small steps still count.",
    "Start with one. Momentum follows.",
    "One now, and today counts.",
  ],
  firmer: [
    "Still at zero? One keeps the day.",
    "Every one opens a door.",
    "Starting is the hardest part.",
    "Future you will thank you.",
  ],
  "last-call": [
    "There's still time for one.",
    "It's late. One still counts.",
    "Just one before you rest.",
  ],
};

// The headline already says how many are done and left, so these only encourage.
const STARTED = ["You're already moving.", "The hard part is done.", "Keep the momentum."];

const DONE = ["This is how big goals happen.", "Be proud of today.", "You showed up today."];

export function levelFor(hour: number): NudgeLevel {
  if (hour >= 19) return "last-call";
  if (hour >= 14) return "firmer";
  return "gentle";
}

function pick(lines: string[], goal: Goal, today: string): string {
  const seed = [...goal.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return lines[(daysBetween("2026-01-01", today) + seed) % lines.length];
}

export function nudgeLine(goal: Goal, plan: TodayPlan, today: string, hour: number): string {
  switch (plan.status) {
    case "complete":
      return `You did it: ${formatCount(goal.target, goal.unit)}.`;
    case "deadline-passed":
      return `${plan.doneTotal} of ${goal.target} is still real progress.`;
    case "paused": {
      const pause = goal.pauses.find((p) => p.from <= today && today <= p.to);
      return pause ? `Paused until ${formatShortDate(pause.to)}. Rest counts too.` : "Paused. Rest counts too.";
    }
    case "done":
      return pick(DONE, goal, today);
    case "started":
      return pick(STARTED, goal, today);
    default:
      return pick(NOT_STARTED[levelFor(hour)], goal, today);
  }
}

/** A not-started line for a calendar reminder, which can't know what has been done. */
export function calendarLine(date: string, hour: number): string {
  const lines = NOT_STARTED[levelFor(hour)];
  return lines[(daysBetween("2026-01-01", date) + hour) % lines.length];
}
