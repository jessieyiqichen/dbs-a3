import type { AppData, Entry, Goal } from "./types";

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
    settings: { reminderTimes: DEFAULT_REMINDER_TIMES, notificationsOn: false },
    lastVisit: null,
  };
}

const isString = (v: unknown): v is string => typeof v === "string";
const isNullableString = (v: unknown) => v === null || isString(v);
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

function isGoal(v: unknown): v is Goal {
  return (
    isRecord(v) &&
    isString(v.id) && isString(v.title) && isString(v.unit) &&
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
  return value as unknown as AppData;
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
