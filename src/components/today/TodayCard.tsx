"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { formatShortDate } from "@/lib/dates";
import { formatCount } from "@/lib/format";
import type { TodayPlan } from "@/lib/quota";
import { updateData } from "@/lib/store";
import type { Goal } from "@/lib/types";

function logOne(goal: Goal, today: string) {
  const entry = { id: crypto.randomUUID(), goalId: goal.id, date: today, amount: 1, at: new Date().toISOString() };
  updateData((data) => ({ ...data, entries: [...data.entries, entry] }));
}

function summary(goal: Goal, plan: TodayPlan): string {
  if (goal.type === "daily") return `${formatCount(goal.target, goal.unit)} every day`;
  const deadline = goal.deadline ? ` by ${formatShortDate(goal.deadline)}` : "";
  return `${plan.doneTotal} of ${goal.target}${deadline} · ${plan.daysLeft} days left`;
}

function headline(goal: Goal, plan: TodayPlan): string {
  if (plan.status === "done") return "Done for today";
  if (plan.status === "started") return `${formatCount(plan.leftToday, goal.unit)} to go`;
  return formatCount(plan.quota, goal.unit);
}

export function TodayCard({ goal, plan, today }: { goal: Goal; plan: TodayPlan; today: string }) {
  return (
    <section aria-labelledby={`goal-${goal.id}`} className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">Today · {goal.title}</p>
        <h1 id={`goal-${goal.id}`} className="text-5xl font-bold tracking-tight text-ink">
          {headline(goal, plan)}
        </h1>
        <p className="text-muted">{summary(goal, plan)}</p>
      </div>

      <p className="text-xl text-ink">
        {plan.doneToday === 0 ? "Just one to start. The rest gets easier." : `${plan.doneToday} done today. Keep it going.`}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        {goal.link && (
          <ButtonLink href={goal.link} external variant="secondary" size="lg">
            Open {new URL(goal.link).hostname.replace(/^www\./, "")}
          </ButtonLink>
        )}
        <Button size="lg" onClick={() => logOne(goal, today)}>
          +1 Done one
        </Button>
      </div>
    </section>
  );
}
