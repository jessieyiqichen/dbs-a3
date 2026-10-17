import { addDays } from "./dates";
import type { Goal, GoalType } from "./types";

export interface Starter {
  key: string;
  label: string;
  title: string;
  unit: string;
  type: GoalType;
  target: number;
  /** For "by-date" starters: how many days from today the deadline falls. */
  daysToDeadline: number | null;
  link: string | null;
}

export const STARTERS: Starter[] = [
  {
    key: "linkedin",
    label: "500 LinkedIn connections",
    title: "Send LinkedIn connection requests",
    unit: "connections",
    type: "by-date",
    target: 500,
    daysToDeadline: 45,
    link: "https://www.linkedin.com/mynetwork/grow/",
  },
  {
    key: "applications",
    label: "Apply to 10 jobs a day",
    title: "Apply to jobs",
    unit: "applications",
    type: "daily",
    target: 10,
    daysToDeadline: null,
    link: null,
  },
];

export function goalFromStarter(starter: Starter, today: string, id: string, now: string): Goal {
  return {
    id,
    title: starter.title,
    unit: starter.unit,
    type: starter.type,
    target: starter.target,
    deadline: starter.daysToDeadline === null ? null : addDays(today, starter.daysToDeadline),
    link: starter.link,
    startDate: today,
    pauses: [],
    createdAt: now,
  };
}
