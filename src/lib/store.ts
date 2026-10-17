"use client";

import { useSyncExternalStore } from "react";
import { browserStore, emptyData, loadData, saveData, STORAGE_KEY } from "./storage";
import type { AppData } from "./types";

export type StoreState =
  | { kind: "ready"; data: AppData; persistent: boolean }
  | { kind: "corrupt"; raw: string };

let cache: StoreState | null = null;
const listeners = new Set<() => void>();

/** How this visit started, captured once per page load before lastVisit is updated. */
export interface VisitStart {
  prevVisit: string | null;
  fromNudge: boolean;
}
let visitStart: VisitStart | null = null;

export function getVisitStart(): VisitStart {
  read();
  return visitStart ?? { prevVisit: null, fromNudge: false };
}

function read(): StoreState {
  if (cache) return cache;
  const result = loadData(browserStore());
  if (visitStart === null) {
    visitStart = {
      prevVisit: result.ok ? result.data.lastVisit : null,
      fromNudge: new URLSearchParams(window.location.search).get("from") === "nudge",
    };
  }
  if (result.ok) cache = { kind: "ready", data: result.data, persistent: true };
  else if (result.reason === "corrupt") cache = { kind: "corrupt", raw: result.raw };
  else cache = { kind: "ready", data: emptyData(), persistent: false };
  return cache;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed the data: re-read it.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cache = null;
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Null while rendering on the server; the saved state once in the browser. */
export function useStore(): StoreState | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** Applies a change and saves it. Returns false if the browser could not save. */
export function updateData(change: (data: AppData) => AppData): boolean {
  const current = read();
  const base = current.kind === "ready" ? current.data : emptyData();
  const next = change(base);
  const saved = saveData(next, browserStore());
  cache = { kind: "ready", data: next, persistent: saved };
  emit();
  return saved;
}

/** The latest data, for timers that fire outside React. */
export function currentData(): AppData | null {
  const state = read();
  return state.kind === "ready" ? state.data : null;
}

export function resetData(): void {
  updateData(() => emptyData());
}
