import { addDays } from "./dates";
import type { GoalType } from "./types";
import type { GoalDraft } from "./validate";

export const DEADLINE_DAYS = 45;

export interface Starter {
  key: string;
  label: string;
  verb: string;
  unit: string;
  type: GoalType;
  target: number;
  link: string | null;
}

/** First-visit choices: recruiting tasks people put off. Numbers are suggestions the person can change. */
export const STARTERS: Starter[] = [
  { key: "linkedin", label: "LinkedIn connections", verb: "Send", unit: "connection requests", type: "by-date", target: 500, link: "https://www.linkedin.com/mynetwork/grow/" },
  { key: "applications", label: "Job applications", verb: "Send", unit: "applications", type: "daily", target: 10, link: null },
  { key: "coffee", label: "Coffee chats", verb: "Message", unit: "people about a coffee chat", type: "daily", target: 2, link: "https://www.linkedin.com/messaging/" },
  { key: "interview", label: "Interview practice", verb: "Practice", unit: "interview questions", type: "daily", target: 2, link: null },
];

export function draftFromStarter(starter: Starter, today: string): GoalDraft {
  return {
    verb: starter.verb,
    unit: starter.unit,
    type: starter.type,
    target: String(starter.target),
    deadline: starter.type === "by-date" ? addDays(today, DEADLINE_DAYS) : "",
    link: starter.link ?? "",
  };
}
