import { daysBetween, formatShortDate } from "./dates";
import { formatCount } from "./format";
import type { TodayPlan } from "./quota";
import type { Goal } from "./types";

export type NudgeLevel = "gentle" | "firmer" | "last-call";

/** A cheerleader's voice, after Duolingo: short, warm, never shaming, eight words at most, and never a full stop
 *  (house style: "!" when it cheers, "~" when it's easygoing). Lines rotate by day. */
const NOT_STARTED: Record<NudgeLevel, string[]> = {
  gentle: [
    "Just one to start today!",
    "One counts, let's go~",
    "Small start, big day!",
    "Open it and do one~",
  ],
  firmer: [
    "Still time! Just one~",
    "One now keeps your streak going!",
    "You've got this, start with one!",
    "Future you says thanks~",
  ],
  "last-call": [
    "There's still time for one!",
    "One before bed? You've got it~",
    "Late, but one still counts!",
  ],
};

// The headline already says how many are done and left, so these only cheer.
const STARTED = ["Nice! Keep it rolling~", "You're on a roll!", "Look at you go!"];

const DONE = ["You showed up again!", "That's how big goals happen~", "Be proud of today!"];

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
      return `You did it, ${formatCount(goal.target, goal.unit)}!`;
    case "deadline-passed":
      return "The date passed, pick a new one and keep going!";
    case "paused": {
      const pause = goal.pauses.find((p) => p.from <= today && today <= p.to);
      return pause ? `Paused until ${formatShortDate(pause.to)}, Titi is napping too~` : "Paused, Titi is napping too~";
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
