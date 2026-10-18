export type GoalType = "by-date" | "daily";

/** A stretch of days (inclusive, YYYY-MM-DD) when a goal is paused. */
export interface Pause {
  from: string;
  to: string;
}

export interface Goal {
  id: string;
  /** Capitalized action, e.g. "Send"; empty for goals saved before verbs existed. */
  verb: string;
  /** Verb + unit, e.g. "Send connection requests". */
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
  /** The last day the downloaded calendar file covers, so Today can say when to grab a new one. */
  calendarUntil: string | null;
}

/** Set when someone taps Start, until they say how many they did. */
export interface Session {
  goalId: string;
  startedAt: string;
}

export interface AppData {
  version: 1;
  goals: Goal[];
  entries: Entry[];
  settings: Settings;
  lastVisit: string | null;
  session: Session | null;
}

export type DayStatus =
  | "not-started"
  | "started"
  | "done"
  | "paused"
  | "complete"
  | "deadline-passed";
