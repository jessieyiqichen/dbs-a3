import type { Goal } from "./types";

/** The line in Titi's speech bubble while you work through today's number.
 *  The very first time, before anything was ever logged, it says how (progressive onboarding: one tip, in place). */
export function sessionLine(done: number, total: number, firstTime = false): string {
  const left = total - done;
  if (done === 0 && firstTime) return "Every one you finish is a fish for me~";
  if (done === 0) return "Ready when you are~";
  if (left <= 0) return "Titi is so full~";
  if (left === 1) return "One more and Titi is full!";
  if (done === 1) return "First one down!";
  return `${done} down, ${left} to go!`;
}

export type BowlFill = "empty" | "some" | "full";

/** How full Titi's bowl looks: fish go in as you log, and it is heaped once today's number is reached. */
export function bowlFill(done: number, total: number): BowlFill {
  if (done <= 0) return "empty";
  return done >= total ? "full" : "some";
}

export interface DoneStat {
  label: string;
  value: number;
  suffix: string;
}

/** The three numbers on the done screen: today's fish, the streak, and how far the whole goal has come. */
export function doneStats(goal: Goal, { doneToday, doneTotal, streakDays }: { doneToday: number; doneTotal: number; streakDays: number }): DoneStat[] {
  const road =
    goal.type === "by-date"
      ? { label: `Road to ${goal.target}`, value: Math.min(100, Math.round((doneTotal / Math.max(goal.target, 1)) * 100)), suffix: "%" }
      : { label: "All time", value: doneTotal, suffix: "" };
  return [
    { label: "Fish today", value: doneToday, suffix: "" },
    { label: "Streak", value: streakDays, suffix: streakDays === 1 ? " day" : " days" },
    road,
  ];
}

const MILESTONES: [number, string][] = [
  [0.75, "Three quarters of the road, almost there!"],
  [0.5, "Halfway there!"],
  [0.25, "A quarter of the road done, nice!"],
];

/** For a by-date goal: the milestone today crossed, if any (the highest one between yesterday's total and today's). */
export function milestoneLine(goal: Goal, doneTotal: number, doneToday: number): string | null {
  if (goal.type !== "by-date" || goal.target <= 0) return null;
  const before = (doneTotal - doneToday) / goal.target;
  const now = doneTotal / goal.target;
  const hit = MILESTONES.find(([m]) => before < m && now >= m);
  return hit ? hit[1] : null;
}
