"use client";

import { toISODate } from "@/lib/dates";
import { planToday } from "@/lib/quota";
import { useStore } from "@/lib/store";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { FirstVisit } from "./FirstVisit";
import { TodayCard } from "./TodayCard";

export function TodayScreen() {
  const state = useStore();
  if (state === null) return <p className="pt-6 text-muted">Loading your goals…</p>;
  if (state.kind === "corrupt") return <StorageNotice state={state} />;

  const today = toISODate(new Date());
  const [goal] = state.data.goals;
  return (
    <>
      {!state.persistent && <StorageNotice state={state} />}
      {goal ? <TodayCard goal={goal} plan={planToday(goal, state.data.entries, today)} today={today} /> : <FirstVisit />}
    </>
  );
}
