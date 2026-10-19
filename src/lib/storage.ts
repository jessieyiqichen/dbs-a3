import type { AppData, Entry, Goal, GoalPast } from "./types";

export const STORAGE_KEY = "nudge:v1";
export const DEFAULT_REMINDER_TIMES = ["10:00", "15:00", "20:00"];

interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export type LoadResult =
  | { ok: true; data: AppData }
  | { ok: false; reason: "unavailable" }
  | { ok: false; reason: "corrupt"; raw: string };

export function emptyData(): AppData {
  return {
    version: 1,
    goals: [],
    entries: [],
    settings: { reminderTimes: DEFAULT_REMINDER_TIMES, notificationsOn: false, nudgesSetUp: false, nudgePromptSnoozedOn: null, weekSummarySeenFor: null, streakTipSeen: false, calendarUntil: null },
    lastVisit: null,
    session: null,
  };
}

const isString = (v: unknown): v is string => typeof v === "string";
const isNullableString = (v: unknown) => v === null || isString(v);
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

/** A kept record of a goal's past number (see Goal.history); anything malformed is dropped, not trusted. */
function isGoalPast(v: unknown): v is GoalPast {
  return (
    isRecord(v) &&
    isString(v.to) && /^\d{4}-\d{2}-\d{2}$/.test(v.to) &&
    typeof v.target === "number" && Number.isInteger(v.target) && v.target > 0 &&
    (v.type === "daily" || v.type === "by-date") &&
    (v.deadline === null || isString(v.deadline))
  );
}

function isGoal(v: unknown): v is Omit<Goal, "verb"> & { verb?: unknown } {
  return (
    isRecord(v) &&
    isString(v.id) && isString(v.title) && isString(v.unit) &&
    (v.verb === undefined || isString(v.verb)) &&
    (v.type === "by-date" || v.type === "daily") &&
    typeof v.target === "number" && v.target > 0 &&
    isNullableString(v.deadline) && isNullableString(v.link) &&
    isString(v.startDate) && isString(v.createdAt) &&
    Array.isArray(v.pauses) && v.pauses.every((p) => isRecord(p) && isString(p.from) && isString(p.to))
  );
}

function isEntry(v: unknown): v is Entry {
  return (
    isRecord(v) &&
    isString(v.id) && isString(v.goalId) && isString(v.date) && isString(v.at) &&
    typeof v.amount === "number"
  );
}

/** Parses and validates saved or imported data. Returns null if the shape is wrong. */
export function parseData(text: string): AppData | null {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return null;
  }
  if (!isRecord(value) || value.version !== 1) return null;
  const { goals, entries, settings, lastVisit } = value;
  if (!Array.isArray(goals) || !goals.every(isGoal)) return null;
  if (!Array.isArray(entries) || !entries.every(isEntry)) return null;
  if (!isRecord(settings) || !Array.isArray(settings.reminderTimes)) return null;
  if (!settings.reminderTimes.every(isString) || typeof settings.notificationsOn !== "boolean") return null;
  if (!isNullableString(lastVisit)) return null;
  const session = isRecord(value.session) && isString(value.session.goalId) && isString(value.session.startedAt)
    ? { goalId: value.session.goalId, startedAt: value.session.startedAt }
    : null;
  return {
    version: 1,
    // Goals saved before verbs existed get an empty verb.
    goals: goals.map((g) => {
      const { history, ...rest } = g as typeof g & { history?: unknown };
      const kept = Array.isArray(history) ? history.filter(isGoalPast) : [];
      return { ...rest, verb: isString(g.verb) ? g.verb : "", ...(kept.length > 0 ? { history: kept } : {}) };
    }),
    entries,
    // Settings added after the first release default to false.
    settings: {
      reminderTimes: settings.reminderTimes,
      notificationsOn: settings.notificationsOn,
      nudgesSetUp: settings.nudgesSetUp === true,
      // A date or nothing; the old forever "Not now" flag is dropped, so the prompt asks again
      nudgePromptSnoozedOn: isString(settings.nudgePromptSnoozedOn) && /^\d{4}-\d{2}-\d{2}$/.test(settings.nudgePromptSnoozedOn) ? settings.nudgePromptSnoozedOn : null,
      weekSummarySeenFor: isString(settings.weekSummarySeenFor) && /^\d{4}-\d{2}-\d{2}$/.test(settings.weekSummarySeenFor) ? settings.weekSummarySeenFor : null,
      streakTipSeen: settings.streakTipSeen === true,
      calendarUntil: isString(settings.calendarUntil) ? settings.calendarUntil : null,
    },
    lastVisit,
    session,
  };
}

export function loadData(store: KeyValueStore | null): LoadResult {
  if (!store) return { ok: false, reason: "unavailable" };
  const raw = store.getItem(STORAGE_KEY);
  if (raw === null) return { ok: true, data: emptyData() };
  const data = parseData(raw);
  return data ? { ok: true, data } : { ok: false, reason: "corrupt", raw };
}

export function saveData(data: AppData, store: KeyValueStore | null): boolean {
  if (!store) return false;
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Nudge: could not save to localStorage", error);
    return false;
  }
}

/** localStorage, or null when the browser blocks it (private mode, disabled storage). */
export function browserStore(): KeyValueStore | null {
  try {
    const probe = "nudge:probe";
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}
