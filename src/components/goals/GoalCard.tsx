"use client";

import Link from "next/link";
import { formatShortDate } from "@/lib/dates";
import { formatCount } from "@/lib/format";
import type { TodayPlan } from "@/lib/quota";
import type { Goal } from "@/lib/types";

interface Props {
  goal: Goal;
  plan: TodayPlan;
  today: string;
}

function line(goal: Goal, plan: TodayPlan, today: string): string {
  const pause = goal.pauses.find((p) => p.from <= today && today <= p.to);
  if (pause) return `Taking a break until ${formatShortDate(pause.to)}`;
  if (plan.status === "complete") return "Goal reached!";
  if (plan.status === "deadline-passed") return `${plan.doneTotal} of ${goal.target}, the date passed`;
  if (goal.type === "daily") return plan.status === "done" ? "Done for today!" : `${formatCount(goal.target, goal.unit)} a day`;
  return `${plan.doneTotal} of ${goal.target} by ${formatShortDate(goal.deadline ?? today)}`;
}

/** One goal in the list: the whole card opens its progress; edit, pause and delete live there. */
export function GoalCard({ goal, plan, today }: Props) {
  const pct = goal.type === "by-date" ? Math.min(100, Math.round((plan.doneTotal / Math.max(goal.target, 1)) * 100)) : null;
  const done = plan.status === "done" || plan.status === "complete";
  return (
    <li>
      <Link href={`/goals/${goal.id}`} className="clay clay-press flex flex-col gap-2 rounded-3xl bg-surface px-5 py-4 hover:bg-wash focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus">
        <span className="flex items-center justify-between gap-3">
          <span className="font-display text-lg font-semibold text-ink">{goal.title}</span>
          {!done && <span aria-hidden="true" className="text-muted">→</span>}
        </span>
        <span className="text-sm font-bold text-muted">{line(goal, plan, today)}</span>
        {pct !== null && (
          <span className="h-2.5 w-full overflow-hidden rounded-full bg-wash-strong" role="progressbar" aria-label={`${goal.title}: ${pct}% of the way`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <span className="block h-full rounded-full bg-reward" style={{ width: `${pct}%` }} />
          </span>
        )}
      </Link>
    </li>
  );
}
