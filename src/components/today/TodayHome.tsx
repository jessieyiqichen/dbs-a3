"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import { nudgeLine } from "@/lib/nudges";
import { countOf, headline } from "@/lib/phrases";
import type { TodayPlan } from "@/lib/quota";
import type { BowlDay } from "@/lib/scene";
import { siteName } from "@/lib/start";
import type { Goal } from "@/lib/types";
import type { CatEffect, CatMood } from "./CatArt";
import { Room } from "./Room";

interface Props {
  goal: Goal;
  plan: TodayPlan;
  today: string;
  hour: number;
  bowls: BowlDay[];
  /** The welcome-back line, shown in Titi's bubble instead of the nudge. */
  welcome: string | null;
  next: Goal | null;
  corner?: React.ReactNode;
  onStart: () => void;
  onStartNext: () => void;
  /** True right after a log: Titi hops. */
  cheer?: boolean;
}

type Status = TodayPlan["status"];

function title(goal: Goal, plan: TodayPlan): string {
  switch (plan.status) {
    case "started": return `${plan.doneToday} done, ${plan.leftToday} to go!`;
    case "done": return "Done for today!";
    case "paused": return "Paused";
    case "complete": return "Goal reached!";
    // Progress first, then the push to keep going: encouraging, not a verdict
    case "deadline-passed": return plan.doneTotal > 0 ? `${plan.doneTotal} of ${goal.target}, nice work!` : "Ready for a fresh start?";
    default: return headline(goal.verb, plan.quota, goal.unit);
  }
}

/** Titi in every state: asleep before you start or while paused, sitting with you otherwise, jumping when the goal is reached. */
function catFor(status: Status, cheer: boolean): { mood: CatMood; effect?: CatEffect } {
  if (status === "not-started" || status === "paused") return { mood: "sleep", effect: "zzz" };
  if (status === "complete") return { mood: "celebrate", effect: "party" };
  if (status === "done") return { mood: "idle", effect: "party" };
  return { mood: "idle", effect: cheer ? "hop" : undefined };
}

function Road({ goal, plan }: { goal: Goal; plan: TodayPlan }) {
  if (goal.type !== "by-date") {
    return <p className="clay rounded-2xl bg-surface px-4 py-3 text-center font-bold text-muted">{countOf(plan.doneTotal, goal.unit)} all time</p>;
  }
  const pct = Math.min(100, Math.round((plan.doneTotal / Math.max(goal.target, 1)) * 100));
  return (
    <div className="clay flex items-center gap-3 rounded-2xl bg-surface px-4 py-3">
      <span className="font-display font-semibold text-ink">Road to {goal.target}</span>
      <div role="progressbar" aria-label={`Road to ${goal.target}`} aria-valuemin={0} aria-valuemax={goal.target} aria-valuenow={plan.doneTotal} className="h-3 flex-1 overflow-hidden rounded-full bg-wash-strong">
        <div className="h-full rounded-full bg-reward shadow-[inset_0_2px_0_rgba(255,255,255,.5)]" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-extrabold tabular-nums text-muted">{plan.doneTotal} done</span>
    </div>
  );
}

/** Today: Titi's room with this week's bowls on the sill, one sentence in Titi's bubble, and one button. */
export function TodayHome({ goal, plan, today, hour, bowls, welcome, next, corner, onStart, onStartNext, cheer = false }: Props) {
  const site = siteName(goal.link);
  const active = plan.status === "not-started" || plan.status === "started";
  const line = plan.status === "done" ? "Titi is so full! See you tomorrow~" : (welcome ?? nudgeLine(goal, plan, today, hour));
  const cat = { ...catFor(plan.status, cheer), key: cheer ? "cheer" : plan.status };
  return (
    <section aria-labelledby={`goal-${goal.id}`} className="flex flex-col">
      <Room bowls={bowls} cat={cat} corner={corner} />
      <div className="clay relative mx-auto mt-5 w-full max-w-[430px] rounded-3xl bg-surface px-5 py-4">
        <ScreenHeading id={`goal-${goal.id}`} className="font-display text-2xl font-bold leading-tight text-ink [text-wrap:balance]">{title(goal, plan)}</ScreenHeading>
        <p className="mt-1 font-bold text-muted">{line}</p>
      </div>
      <div className="mx-auto mt-4 flex w-full max-w-[430px] flex-col gap-3">
        {active && (
          <Button size="lg" onClick={onStart} className="w-full">
            {plan.status === "started" ? "Keep going" : "Start"}{site ? ` on ${site}` : ""} {site && <><span aria-hidden="true">↗</span><span className="sr-only">(opens in a new tab)</span></>}
          </Button>
        )}
        {plan.status === "done" && next && <Button size="lg" onClick={onStartNext} className="w-full">Next: {next.title} →</Button>}
        {plan.status === "complete" && <ButtonLink href="/goals/new" size="lg" className="w-full">Set the next goal</ButtonLink>}
        {plan.status === "deadline-passed" && <ButtonLink href={`/goals/${goal.id}/edit`} size="lg" className="w-full">Pick a new date</ButtonLink>}
        {plan.status === "paused" && <ButtonLink href="/goals" variant="secondary" className="self-start">Manage goals</ButtonLink>}
        <Road goal={goal} plan={plan} />
      </div>
    </section>
  );
}
