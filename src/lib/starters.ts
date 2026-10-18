import type { GoalType } from "./types";

export interface Starter {
  key: string;
  label: string;
  verb: string;
  unit: string;
  type: GoalType;
  link: string | null;
}

/** First-visit choices: recruiting tasks people put off. How many and by when are asked next, one tap each. */
export const STARTERS: Starter[] = [
  { key: "linkedin", label: "LinkedIn connections", verb: "Send", unit: "connection requests", type: "by-date", link: "https://www.linkedin.com/mynetwork/grow/" },
  { key: "applications", label: "Job applications", verb: "Send", unit: "applications", type: "daily", link: null },
  { key: "coffee", label: "Coffee chats", verb: "Message", unit: "people about a coffee chat", type: "daily", link: null }, // no channel assumed: email, WeChat, alumni sites all count (user, 2026-10-18)
  { key: "interview", label: "Interview practice", verb: "Practice", unit: "interview questions", type: "daily", link: null },
];
