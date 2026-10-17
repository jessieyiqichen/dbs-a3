import { formatShortDate } from "./dates";
import type { GoalType } from "./types";

/** Makes the counted noun singular: the first word that is "people" or a plural ending in s. */
export function singular(unit: string): string {
  const words = unit.split(" ");
  const i = words.findIndex((w) => w === "people" || (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")));
  if (i < 0) return unit;
  const one = words[i] === "people" ? "person" : words[i].slice(0, -1);
  return [...words.slice(0, i), one, ...words.slice(i + 1)].join(" ");
}

export function countOf(n: number, unit: string): string {
  return `${n} ${n === 1 ? singular(unit) : unit}`;
}

/** "Send 11 connection requests": what to do, how many. */
export function headline(verb: string, n: number, unit: string): string {
  return verb ? `${verb} ${countOf(n, unit)}` : countOf(n, unit);
}

interface SentenceParts {
  verb: string;
  unit: string;
  type: GoalType;
  /** Null while the number isn't valid yet. */
  target: number | null;
  deadline: string | null;
}

/** The goal in the person's own words: "I want to send 500 connection requests by Dec 1." */
export function goalSentence({ verb, unit, type, target, deadline }: SentenceParts): string {
  if (!verb.trim()) return "I want to \u2026";
  const amount = target === null ? `some ${unit}` : countOf(target, unit);
  const what = `${verb.trim().toLowerCase()} ${amount}`;
  const when = type === "daily" ? "every day" : deadline ? `by ${formatShortDate(deadline)}` : "by a date you pick";
  return `I want to ${what} ${when}.`;
}

/** One-tap amounts for "How many did you do?": about a quarter, half, three quarters, and all that's left. */
export function quickAmounts(left: number): number[] {
  if (left <= 0) return [1, 2, 5];
  return [...new Set([0.25, 0.5, 0.75, 1].map((f) => Math.max(1, Math.round(left * f))))];
}
