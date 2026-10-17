"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import { nudgeLine } from "@/lib/nudges";
import { headline } from "@/lib/phrases";
import type { TodayPlan } from "@/lib/quota";
import { siteName } from "@/lib/start";
import type { Goal } from "@/lib/types";

interface Props {
  goal: Goal;
  plan: TodayPlan;
  today: string;
  hour: number;
  onStart: () => void;
}

/** Only for by-date goals; a daily goal's headline already says it all. */
function summary(goal: Goal, plan: TodayPlan): string | null {
  if (goal.type === "daily") return null;
  return `${plan.doneTotal} of ${goal.target} · ${plan.daysLeft} days left`;
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
  const site = siteName(goal.link);
  const active = plan.status === "not-started" || plan.status === "started";
  const line = summary(goal, plan);
  const action = plan.status === "started" ? "Keep going" : "Start";
  return (
    <section aria-labelledby={`goal-${goal.id}`} className="flex flex-col gap-6 pt-8">
      <div className="flex flex-col gap-2">
        <ScreenHeading id={`goal-${goal.id}`} className="text-4xl font-bold leading-tight tracking-tight text-ink">{title(goal, plan)}</ScreenHeading>
        {line && <p className="text-muted">{line}</p>}
        {goal.type === "by-date" && <ProgressBar value={plan.doneTotal} max={goal.target} label={`${goal.title}: ${plan.doneTotal} of ${goal.target}`} showPercent={false} />}
      </div>
      <p className="text-xl text-ink">{nudgeLine(goal, plan, today, hour)}</p>

      {active && (
        <Button size="lg" onClick={onStart} className="w-full sm:w-auto sm:self-start">
          {site ? (
            <>
              {action} on {site} <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </>
          ) : (
            `${action} →`
          )}
        </Button>
      )}
      {plan.status === "complete" && <ButtonLink href="/goals/new" size="lg" className="self-start">Set the next goal</ButtonLink>}
      {plan.status === "deadline-passed" && <ButtonLink href={`/goals/${goal.id}/edit`} size="lg" className="self-start">Pick a new date</ButtonLink>}
      {plan.status === "paused" && <ButtonLink href="/goals" variant="secondary" className="self-start">Manage goals</ButtonLink>}
    </section>
  );
}
