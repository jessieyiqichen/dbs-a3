"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import { formatShortDate } from "@/lib/dates";
import { formatCount } from "@/lib/format";
import { nudgeLine } from "@/lib/nudges";
import { headline } from "@/lib/phrases";
import type { TodayPlan } from "@/lib/quota";
import { hostOf } from "@/lib/start";
import type { Goal } from "@/lib/types";

interface Props {
  goal: Goal;
  plan: TodayPlan;
  today: string;
  hour: number;
  onStart: () => void;
}

function summary(goal: Goal, plan: TodayPlan): string {
  if (goal.type === "daily") return `${formatCount(goal.target, goal.unit)} every day`;
  const behind = plan.behindBy > 0 ? ` · ${plan.behindBy} behind plan, spread over the days left` : "";
  return `${plan.doneTotal} of ${goal.target}${goal.deadline ? ` by ${formatShortDate(goal.deadline)}` : ""} · ${plan.daysLeft} days left${behind}`;
}

function title(goal: Goal, plan: TodayPlan): string {
  if (plan.status === "started") return `${plan.doneToday} done. ${plan.leftToday} to go.`;
  if (plan.status === "paused") return "Paused";
  if (plan.status === "complete") return "Goal reached";
  if (plan.status === "deadline-passed") return "The deadline has passed";
  return headline(goal.verb, plan.quota, goal.unit);
}

/** Today's one thing: a sentence, progress, a nudge, and one button. */
export function TodayCard({ goal, plan, today, hour, onStart }: Props) {
  const host = hostOf(goal.link);
  const active = plan.status === "not-started" || plan.status === "started";
  return (
    <section aria-labelledby={`goal-${goal.id}`} className="flex flex-col gap-5 pt-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">Today</p>
        <ScreenHeading id={`goal-${goal.id}`} className="text-4xl font-bold leading-tight tracking-tight text-ink">{title(goal, plan)}</ScreenHeading>
        <p className="text-muted">{summary(goal, plan)}</p>
        {goal.type === "by-date" && <ProgressBar value={plan.doneTotal} max={goal.target} label={`${goal.title}: ${plan.doneTotal} of ${goal.target}`} />}
      </div>
      <p className="text-xl text-ink">{nudgeLine(goal, plan, today, hour)}</p>

      {active && (
        <div className="flex flex-col gap-2">
          <Button size="lg" onClick={onStart} className="w-full sm:w-auto sm:self-start">
            {plan.status === "started" ? "Keep going →" : "Start →"}
          </Button>
          <p className="text-sm text-muted">{host ? `Opens ${host} in a new tab.` : "Go do it, then come back and tell me how many."}</p>
        </div>
      )}
      {plan.status === "complete" && <ButtonLink href="/goals/new" size="lg" className="self-start">Set the next goal</ButtonLink>}
      {plan.status === "deadline-passed" && <ButtonLink href={`/goals/${goal.id}/edit`} size="lg" className="self-start">Pick a new date</ButtonLink>}
      {plan.status === "paused" && <ButtonLink href="/goals" variant="secondary" className="self-start">Manage goals</ButtonLink>}
    </section>
  );
}
