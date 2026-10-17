"use client";

import { startSession } from "./actions";
import { setFocusGoal } from "./store";
import type { Goal } from "./types";

/** Start: open the goal's page in a new tab (if it has one) and ask how many on return. */
export function startGoal(goal: Goal): void {
  if (goal.link) window.open(goal.link, "_blank", "noopener,noreferrer");
  setFocusGoal(goal.id);
  startSession(goal.id);
}

export function hostOf(link: string | null): string | null {
  if (!link) return null;
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

const SITE_NAMES: Record<string, string> = { "linkedin.com": "LinkedIn", "leetcode.com": "LeetCode", "github.com": "GitHub" };

/** "LinkedIn" for linkedin.com; otherwise the first part of the host, capitalized. */
export function siteName(link: string | null): string | null {
  const host = hostOf(link);
  if (!host) return null;
  return SITE_NAMES[host] ?? host.split(".")[0].replace(/^./, (c) => c.toUpperCase());
}
