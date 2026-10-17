"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { deleteGoal, pauseGoal, resumeGoal } from "@/lib/actions";
import { formatShortDate } from "@/lib/dates";
import { formatCount } from "@/lib/format";
import type { TodayPlan } from "@/lib/quota";
import type { Goal } from "@/lib/types";

const PAUSE_OPTIONS = [
  { days: 3, label: "3 days" },
  { days: 7, label: "1 week" },
  { days: 14, label: "2 weeks" },
];

type Mode = "idle" | "pausing" | "deleting";

interface Props {
  goal: Goal;
  plan: TodayPlan;
  streakDays: number;
  entryCount: number;
  today: string;
}

function summary(goal: Goal, plan: TodayPlan): string {
  if (goal.type === "daily") return `${formatCount(goal.target, goal.unit)} every day`;
  return `${plan.doneTotal} of ${goal.target}${goal.deadline ? ` by ${formatShortDate(goal.deadline)}` : ""}`;
}

export function GoalManageCard({ goal, plan, streakDays, entryCount, today }: Props) {
  const [mode, setMode] = useState<Mode>("idle");
  const pause = goal.pauses.find((p) => p.from <= today && today <= p.to);
  const titleId = `manage-${goal.id}`;
  // Every card has the same buttons, so each name says which goal it acts on.
  const which = <span className="sr-only">: {goal.title}</span>;

  return (
    <li aria-labelledby={titleId} className="flex flex-col gap-3 rounded-lg border-2 border-line bg-surface p-4">
      <div>
        <h2 id={titleId} className="text-lg font-bold text-ink">{goal.title}</h2>
        <p className="text-muted">
          {summary(goal, plan)} · {streakDays === 1 ? "1 day in a row" : `${streakDays} days in a row`}
        </p>
        {pause && <p className="mt-1 font-semibold text-ink">Paused until {formatShortDate(pause.to)}</p>}
      </div>

      {mode === "idle" && (
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={`/goals/${goal.id}`} variant="secondary">View progress{which}</ButtonLink>
          <ButtonLink href={`/goals/${goal.id}/edit`} variant="ghost">Edit{which}</ButtonLink>
          {pause ? (
            <Button variant="ghost" onClick={() => resumeGoal(goal.id, today)}>Resume{which}</Button>
          ) : (
            <Button variant="ghost" aria-expanded={false} onClick={() => setMode("pausing")}>Pause{which}</Button>
          )}
          <Button variant="ghost" onClick={() => setMode("deleting")}>Delete{which}</Button>
        </div>
      )}

      {mode === "pausing" && (
        <div className="flex flex-col gap-2 rounded-lg bg-wash p-3">
          <p className="font-semibold text-ink">Pause for how long? No nudges, and it won&apos;t count as falling behind.</p>
          <div className="flex flex-wrap gap-2">
            {PAUSE_OPTIONS.map((o) => (
              <Button key={o.days} variant="secondary" onClick={() => { pauseGoal(goal.id, o.days, today); setMode("idle"); }}>
                {o.label}
              </Button>
            ))}
            <Button variant="ghost" onClick={() => setMode("idle")}>Cancel</Button>
          </div>
        </div>
      )}

      {mode === "deleting" && (
        <div role="alert" className="flex flex-col gap-2 rounded-lg border-2 border-danger p-3">
          <p className="font-semibold text-ink">
            Delete this goal and its {entryCount === 1 ? "1 entry" : `${entryCount} entries`}? This can&apos;t be undone.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="danger" onClick={() => deleteGoal(goal.id)}>Delete</Button>
            <Button variant="ghost" autoFocus onClick={() => setMode("idle")}>Keep it</Button>
          </div>
        </div>
      )}
    </li>
  );
}
