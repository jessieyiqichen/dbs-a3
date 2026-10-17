import { daysBetween, formatShortDate } from "./dates";
import { formatCount } from "./format";
import type { TodayPlan } from "./quota";
import type { Goal } from "./types";

export type NudgeLevel = "gentle" | "firmer" | "last-call";

/** Warm and motivating, never shaming. Lines rotate by day. */
const NOT_STARTED: Record<NudgeLevel, string[]> = {
  gentle: [
    "Just one to start. The rest gets easier.",
    "Small steps still move you forward. Take the first one now.",
    "Start with one. Momentum will do the rest.",
    "One now, and today already counts.",
  ],
  firmer: [
    "Still at zero today, and that's okay. One is enough to keep the day.",
    "Every one you do is a door that might open. Open one now.",
    "The hardest part is starting. You're closer than you think.",
    "Future you, in the interview, will thank you for this one.",
  ],
  "last-call": [
    "There's still time. One keeps today from being a zero.",
    "It's late, and one still counts. You've got this.",
    "Before you rest, just one. Tomorrow you will be glad.",
  ],
};

const STARTED = [
  "{done} done, {left} to go. You're already moving.",
  "You started, which was the hard part. {left} more.",
  "Nice work so far. {left} to finish today.",
];

const DONE = [
  "Done for today. This is how big goals happen.",
  "Today's {quota} are in. Be proud of that.",
  "You showed up today. See you tomorrow.",
];

export function levelFor(hour: number): NudgeLevel {
  if (hour >= 19) return "last-call";
  if (hour >= 14) return "firmer";
  return "gentle";
}

function pick(lines: string[], goal: Goal, today: string): string {
  const seed = [...goal.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return lines[(daysBetween("2026-01-01", today) + seed) % lines.length];
}

function fill(line: string, goal: Goal, plan: TodayPlan): string {
  return line
    .replace("{done}", formatCount(plan.doneToday, goal.unit))
    .replace("{left}", String(plan.leftToday))
    .replace("{quota}", formatCount(plan.quota, goal.unit));
}

export function nudgeLine(goal: Goal, plan: TodayPlan, today: string, hour: number): string {
  switch (plan.status) {
    case "complete":
      return `You did it: ${formatCount(goal.target, goal.unit)}. Ready to set the next one?`;
    case "deadline-passed":
      return `The deadline passed with ${plan.doneTotal} of ${goal.target}. That's ${plan.doneTotal} more than zero. Pick a new date?`;
    case "paused": {
      const pause = goal.pauses.find((p) => p.from <= today && today <= p.to);
      return pause ? `Paused until ${formatShortDate(pause.to)}. Rest is part of the plan.` : "Paused. Rest is part of the plan.";
    }
    case "done":
      return fill(pick(DONE, goal, today), goal, plan);
    case "started":
      return fill(pick(STARTED, goal, today), goal, plan);
    default:
      return pick(NOT_STARTED[levelFor(hour)], goal, today);
  }
}

/** A not-started line for a calendar reminder, which can't know what has been done. */
export function calendarLine(date: string, hour: number): string {
  const lines = NOT_STARTED[levelFor(hour)];
  return lines[(daysBetween("2026-01-01", date) + hour) % lines.length];
}
