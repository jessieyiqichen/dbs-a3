"use client";

import { useCallback } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { Toast } from "@/components/ui/Toast";
import { restoreGoal } from "@/lib/actions";
import { toISODate } from "@/lib/dates";
import type { Removed } from "@/lib/goals";
import { planToday } from "@/lib/quota";
import { stashRemoved, useRemoved, useStore } from "@/lib/store";
import { BackupSection } from "./BackupSection";
import { GoalCard } from "./GoalCard";

/** Your goals as a list of cards; a goal just removed on its progress page can be put back from here. */
export function GoalsScreen() {
  const state = useStore();
  const removed: Removed | null = useRemoved();
  const closeToast = useCallback(() => stashRemoved(null), []);

  if (state === null) return <p className="pt-6 text-muted">Loading your goals…</p>;
  if (state.kind === "corrupt") return <StorageNotice state={state} />;

  const { data } = state;
  const today = toISODate(new Date());
  return (
    <>
      {!state.persistent && <StorageNotice state={state} />}
      {data.goals.length === 0 ? (
        <div className="mt-8 flex flex-col gap-4">
          <p className="text-lg font-bold text-ink">No goals yet, Titi is waiting~</p>
          <ButtonLink href="/goals/new" className="self-start">Add a goal</ButtonLink>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {data.goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} plan={planToday(goal, data.entries, today)} today={today} />
          ))}
        </ul>
      )}
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        <ButtonLink href="/goals/new" variant="ghost">+ Add a goal</ButtonLink>
        <ButtonLink href="/reminders" variant="ghost">Reminder times</ButtonLink>
      </div>
      <BackupSection data={data} />
      <Toast
        message={removed ? `Removed ${removed.goal.title}` : null}
        onUndo={() => { if (removed) restoreGoal(removed); stashRemoved(null); }}
        onClose={closeToast}
      />
    </>
  );
}
