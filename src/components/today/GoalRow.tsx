"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatCount } from "@/lib/format";
import type { PlannedGoal } from "@/lib/quota";

function statusText({ goal, plan }: PlannedGoal): string {
  switch (plan.status) {
    case "done":
    case "complete":
      return "Done for today ✓";
    case "paused":
      return "Paused";
    case "deadline-passed":
      return "Deadline passed";
    case "started":
      return `${plan.leftToday} to go`;
    default:
      return `${formatCount(plan.quota, goal.unit)} today`;
  }
}

/** Another goal: quiet, with its own secondary Start. */
export function GoalRow({ item, onStart }: { item: PlannedGoal; onStart: () => void }) {
  const canStart = item.plan.status === "not-started" || item.plan.status === "started";
  return (
    <li className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <Link href={`/goals/${item.goal.id}`} className="block truncate text-ink underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-focus">
          {item.goal.title}
        </Link>
        <p className="text-sm text-muted">{statusText(item)}</p>
      </div>
      {canStart && (
        <Button variant="ghost" onClick={onStart}>
          Start<span className="sr-only">: {item.goal.title}</span> <span aria-hidden="true">→</span>
        </Button>
      )}
    </li>
  );
}
