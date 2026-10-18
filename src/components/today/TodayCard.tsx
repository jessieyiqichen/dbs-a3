"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import { nudgeLine } from "@/lib/nudges";
import { headline } from "@/lib/phrases";
import type { TodayPlan } from "@/lib/quota";
import { siteName } from "@/lib/start";
import type { Goal } from "@/lib/types";
import { Coins } from "./Coins";

interface Props {
  goal: Goal;
  plan: TodayPlan;
  today: string;
  hour: number;
  onStart: () => void;
}

function title(goal: Goal, plan: TodayPlan): string {
  if (plan.status === "started") return `${plan.doneToday} done, ${plan.leftToday} to go!`;
  if (plan.status === "paused") return "Paused";
  if (plan.status === "complete") return "Goal reached!";
  if (plan.status === "deadline-passed") return "The deadline has passed";
  return headline(goal.verb, plan.quota, goal.unit);
}

/** Today's one thing: a sentence, a line of cheer, the coins, and one button. Nothing else competes. */
export function TodayCard({ goal, plan, today, hour, onStart }: Props) {
  const site = siteName(goal.link);
  const active = plan.status === "not-started" || plan.status === "started";
  const action = plan.status === "started" ? "Keep going" : "Start";
  return (
    <section aria-labelledby={`goal-${goal.id}`} className="flex flex-col pt-6">
      <ScreenHeading id={`goal-${goal.id}`} className="font-display text-4xl font-bold leading-tight text-ink">{title(goal, plan)}</ScreenHeading>
      <p className="mt-3 text-lg font-bold text-muted">{nudgeLine(goal, plan, today, hour)}</p>

      {active && (
        <>
          <div className="mt-10">
            <Coins total={plan.quota} done={plan.doneToday} label="Today" />
          </div>
          <Button size="lg" onClick={onStart} className="mt-12 w-full">
            {site ? (
              <>
                {action} on {site} <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </>
            ) : (
              `${action} →`
            )}
          </Button>
        </>
      )}
      {plan.status === "complete" && <ButtonLink href="/goals/new" size="lg" className="mt-10 w-full">Set the next goal</ButtonLink>}
      {plan.status === "deadline-passed" && <ButtonLink href={`/goals/${goal.id}/edit`} size="lg" className="mt-10 w-full">Pick a new date</ButtonLink>}
      {plan.status === "paused" && <ButtonLink href="/goals" variant="secondary" className="mt-8 self-start">Manage goals</ButtonLink>}
    </section>
  );
}
