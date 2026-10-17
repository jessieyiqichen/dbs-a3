"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatCount } from "@/lib/format";
import type { PlannedGoal } from "@/lib/quota";

function statusText({ goal, plan }: PlannedGoal): string {
  switch (plan.status) {
    case "done":
    case "complete":
      return "Done for today";
    case "paused":
      return "Paused";
    case "deadline-passed":
      return "Deadline passed";
    case "started":
      return `${formatCount(plan.leftToday, goal.unit)} to go`;
    default:
      return `${formatCount(plan.quota, goal.unit)} today`;
  }
}

export function GoalRow({ item, onLog }: { item: PlannedGoal; onLog: () => void }) {
  const canLog = ["not-started", "started", "done"].includes(item.plan.status);
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border-2 border-line bg-surface p-3">
      <div className="min-w-0">
        <Link href={`/goals/${item.goal.id}`} className="block truncate font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-focus">
          {item.goal.title}
        </Link>
        <p className="text-sm text-muted">{statusText(item)}</p>
      </div>
      {canLog && (
        <Button variant="secondary" onClick={onLog} aria-label={`Add one to ${item.goal.title}`}>
          +1
        </Button>
      )}
    </li>
  );
}
