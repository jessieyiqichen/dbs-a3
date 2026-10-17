export type GoalType = "by-date" | "daily";

/** A stretch of days (inclusive, YYYY-MM-DD) when a goal is paused. */
export interface Pause {
  from: string;
  to: string;
}

export interface Goal {
  id: string;
  title: string;
  /** Plural noun for what is counted, e.g. "connections". */
  unit: string;
  type: GoalType;
  /** Total for "by-date" goals, per day for "daily" goals. */
  target: number;
  /** YYYY-MM-DD, only for "by-date" goals. */
  deadline: string | null;
  link: string | null;
  startDate: string;
  pauses: Pause[];
  createdAt: string;
}

export interface Entry {
  id: string;
  goalId: string;
  date: string;
  amount: number;
  at: string;
}

export interface Settings {
  reminderTimes: string[];
  notificationsOn: boolean;
  /** True once a calendar file was downloaded or notifications were turned on. */
  nudgesSetUp: boolean;
  /** True after "Not now" on the set-up-nudges prompt. */
  nudgePromptDismissed: boolean;
}

export interface AppData {
  version: 1;
  goals: Goal[];
  entries: Entry[];
  settings: Settings;
  lastVisit: string | null;
}

export type DayStatus =
  | "not-started"
  | "started"
  | "done"
  | "paused"
  | "complete"
  | "deadline-passed";
