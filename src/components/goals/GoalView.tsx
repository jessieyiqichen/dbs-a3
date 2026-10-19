"use client";

import { ProgressScreen } from "@/components/progress/ProgressScreen";
import { useDesktop } from "@/lib/useDesktop";
import { GoalsScreen } from "./GoalsScreen";

/** A goal's own page: on a phone its progress alone; on a desktop the goal list with this goal chosen beside it. */
export function GoalView({ id, fromToday }: { id: string; fromToday: boolean }) {
  const desktop = useDesktop();
  return desktop ? <GoalsScreen selected={id} fromToday={fromToday} /> : <ProgressScreen id={id} fromToday={fromToday} />;
}
