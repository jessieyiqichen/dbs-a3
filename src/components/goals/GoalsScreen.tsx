"use client";

import { ButtonLink } from "@/components/ui/Button";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { toISODate } from "@/lib/dates";
import { planToday } from "@/lib/quota";
import { useStore } from "@/lib/store";
import { streak } from "@/lib/streak";
import { BackupSection } from "./BackupSection";
import { GoalManageCard } from "./GoalManageCard";

export function GoalsScreen() {
  const state = useStore();
  if (state === null) return <p className="pt-6 text-muted">Loading your goals…</p>;
  if (state.kind === "corrupt") return <StorageNotice state={state} />;

  const { data } = state;
  const today = toISODate(new Date());
  return (
    <>
      {!state.persistent && <StorageNotice state={state} />}
      {data.goals.length === 0 ? (
        <div className="mt-8 flex flex-col gap-4">
          <p className="text-lg text-ink">No goals yet. Pick one on Today, or write your own.</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/">Go to Today</ButtonLink>
            <ButtonLink href="/goals/new" variant="secondary">Add a goal</ButtonLink>
          </div>
        </div>
      ) : (
        <>
          <ul className="mt-8 flex flex-col gap-3">
            {data.goals.map((goal) => (
              <GoalManageCard
                key={goal.id}
                goal={goal}
                plan={planToday(goal, data.entries, today)}
                streakDays={streak(goal, data.entries, today).days}
                entryCount={data.entries.filter((e) => e.goalId === goal.id).length}
                today={today}
              />
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-x-6">
            <ButtonLink href="/goals/new" variant="ghost">+ Add a goal</ButtonLink>
            <ButtonLink href="/reminders" variant="ghost">Reminder times</ButtonLink>
          </div>
        </>
      )}
      <BackupSection data={data} />
    </>
  );
}
