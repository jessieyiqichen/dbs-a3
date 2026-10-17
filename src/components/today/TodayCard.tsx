"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { formatShortDate } from "@/lib/dates";
import { formatCount } from "@/lib/format";
import { nudgeLine } from "@/lib/nudges";
import type { TodayPlan } from "@/lib/quota";
import type { Goal } from "@/lib/types";
import { LogSeveral } from "./LogSeveral";

interface TodayCardProps {
  goal: Goal;
  plan: TodayPlan;
  today: string;
  hour: number;
  onLog: (amount: number) => void;
}

function summary(goal: Goal, plan: TodayPlan): string {
  if (goal.type === "daily") return `${formatCount(goal.target, goal.unit)} every day`;
  const deadline = goal.deadline ? ` by ${formatShortDate(goal.deadline)}` : "";
  return `${plan.doneTotal} of ${goal.target}${deadline} · ${plan.daysLeft} days left`;
}

function headline(goal: Goal, plan: TodayPlan): string {
  if (plan.status === "done" || plan.status === "complete") return "Done for today";
  if (plan.status === "paused") return "Paused";
  if (plan.status === "started") return `${formatCount(plan.leftToday, goal.unit)} to go`;
  return formatCount(plan.quota, goal.unit);
}

const ACTIVE = new Set(["not-started", "started", "done"]);

export function TodayCard({ goal, plan, today, hour, onLog }: TodayCardProps) {
  const host = goal.link ? new URL(goal.link).hostname.replace(/^www\./, "") : null;
  return (
    <section aria-labelledby={`goal-${goal.id}`} className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">Today · {goal.title}</p>
        <h1 id={`goal-${goal.id}`} className="text-5xl font-bold tracking-tight text-ink">
          {headline(goal, plan)}
        </h1>
        <p className="text-muted">{summary(goal, plan)}</p>
      </div>

      <p className="text-xl text-ink">{nudgeLine(goal, plan, today, hour)}</p>

      {plan.behindBy > 0 && plan.status === "not-started" && (
        <p className="rounded-lg bg-wash p-3 text-sm text-ink">
          You&apos;re {formatCount(plan.behindBy, goal.unit)} behind your plan, so it&apos;s spread over the{" "}
          {plan.daysLeft} days left. No need to catch up in one day.
        </p>
      )}

      {ACTIVE.has(plan.status) && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            {goal.link && host && (
              <ButtonLink href={goal.link} external variant="secondary" size="lg">
                Open {host}
              </ButtonLink>
            )}
            <Button size="lg" onClick={() => onLog(1)}>
              +1 Done one
            </Button>
          </div>
          <LogSeveral unit={goal.unit} onAdd={onLog} />
        </div>
      )}
    </section>
  );
}
