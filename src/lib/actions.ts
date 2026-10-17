"use client";

import { updateData } from "./store";
import { withPause, withoutPause } from "./progress";
import type { AppData, Entry, Goal, Settings } from "./types";
import type { GoalValues } from "./validate";

export function addEntry(goalId: string, amount: number, date: string): Entry {
  const entry: Entry = { id: crypto.randomUUID(), goalId, date, amount, at: new Date().toISOString() };
  // Logging answers "how many did you do?", so it ends that goal's session.
  updateData((data) => ({
    ...data,
    entries: [...data.entries, entry],
    session: data.session?.goalId === goalId ? null : data.session,
  }));
  return entry;
}

export function removeEntry(entryId: string): void {
  updateData((data) => ({ ...data, entries: data.entries.filter((e) => e.id !== entryId) }));
}

export function markVisited(today: string): void {
  updateData((data) => (data.lastVisit === today ? data : { ...data, lastVisit: today }));
}

export function updateSettings(change: Partial<Settings>): void {
  updateData((data) => ({ ...data, settings: { ...data.settings, ...change } }));
}

export function addGoal(values: GoalValues, today: string): Goal {
  const goal: Goal = { ...values, id: crypto.randomUUID(), startDate: today, pauses: [], createdAt: new Date().toISOString() };
  updateData((data) => ({ ...data, goals: [...data.goals, goal] }));
  return goal;
}

export function updateGoal(id: string, values: GoalValues): void {
  updateData((data) => ({ ...data, goals: data.goals.map((g) => (g.id === id ? { ...g, ...values } : g)) }));
}

function changeGoal(id: string, change: (goal: Goal) => Goal): void {
  updateData((data) => ({ ...data, goals: data.goals.map((g) => (g.id === id ? change(g) : g)) }));
}

export function pauseGoal(id: string, days: number, today: string): void {
  changeGoal(id, (g) => withPause(g, days, today));
}

export function resumeGoal(id: string, today: string): void {
  changeGoal(id, (g) => withoutPause(g, today));
}

export function deleteGoal(id: string): void {
  updateData((data) => ({
    ...data,
    goals: data.goals.filter((g) => g.id !== id),
    entries: data.entries.filter((e) => e.goalId !== id),
  }));
}

/** Replaces everything on this device with a validated backup. */
export function restoreData(backup: AppData): void {
  updateData(() => backup);
}

/** Tapping Start: remember which goal, so coming back asks how many. */
export function startSession(goalId: string): void {
  updateData((data) => ({ ...data, session: { goalId, startedAt: new Date().toISOString() } }));
}

export function endSession(): void {
  updateData((data) => ({ ...data, session: null }));
}
