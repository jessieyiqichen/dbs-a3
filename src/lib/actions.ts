"use client";

import { updateData } from "./store";
import type { Entry, Settings } from "./types";

export function addEntry(goalId: string, amount: number, date: string): Entry {
  const entry: Entry = { id: crypto.randomUUID(), goalId, date, amount, at: new Date().toISOString() };
  updateData((data) => ({ ...data, entries: [...data.entries, entry] }));
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
