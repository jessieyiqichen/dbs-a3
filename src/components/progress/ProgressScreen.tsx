"use client";

import { CatArt } from "@/components/today/CatArt";
import { ButtonLink } from "@/components/ui/Button";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { formatShortDate, toISODate } from "@/lib/dates";
import { formatCount } from "@/lib/format";
import { planToday } from "@/lib/quota";
import { useStore } from "@/lib/store";
import { streak } from "@/lib/streak";
import type { Goal } from "@/lib/types";
import type { TodayPlan } from "@/lib/quota";
import { diaryWeeks, roadStory } from "@/lib/story";
import { Diary } from "./Diary";
import { Road } from "./Road";
import { GoalActions } from "./GoalActions";

function paceLine(goal: Goal, plan: TodayPlan, today: string): string {
  if (plan.status === "complete") return "Goal reached, Titi is proud!";
  if (plan.daysLeft === null) return "";
  if (plan.behindBy > 0) return `${plan.behindBy} behind the steady pace, spread over ${plan.daysLeft} days, so today is ${formatCount(plan.quota, goal.unit)}~`;
  return `On pace! ${plan.daysLeft} days left until ${formatShortDate(goal.deadline ?? today)}`;
}

/** One goal's story so far: the big number, the chart, the run of days, and what you can do with the goal. */
export function ProgressScreen({ id }: { id: string }) {
  const state = useStore();
  if (state === null) return <p className="pt-6 text-muted">Loading your progress…</p>;
  if (state.kind === "corrupt") return <StorageNotice state={state} />;

  const { data } = state;
  const goal = data.goals.find((g) => g.id === id);
  if (!goal) {
    return (
      <div className="mt-8 flex flex-col gap-4">
        <p className="text-lg font-bold text-ink">This goal isn&apos;t saved on this device, it may have been removed~</p>
        <ButtonLink href="/goals" className="self-start">See your goals</ButtonLink>
      </div>
    );
  }

  const today = toISODate(new Date());
  const plan = planToday(goal, data.entries, today);
  const run = streak(goal, data.entries, today);
  const lastRest = run.restDays[0];
  const byDate = goal.type === "by-date";

  return (
    <div className="flex flex-col gap-7 pt-2">
      <div className="flex items-end gap-3">
        <CatArt mood={plan.status === "done" || plan.status === "complete" ? "celebrate" : "idle"} className="w-24 shrink-0" />
        <div className="clay mb-6 flex-1 rounded-2xl rounded-bl-sm bg-surface px-4 py-3">
          <p className="font-display text-sm font-semibold text-muted">{goal.title}</p>
          <p className="font-display text-3xl font-bold leading-tight text-ink tabular-nums">
            {byDate ? `${plan.doneTotal} of ${goal.target}` : `${formatCount(goal.target, goal.unit)} a day`}
          </p>
          {byDate && <p className="mt-1 text-sm font-bold text-muted">{paceLine(goal, plan, today)}</p>}
        </div>
      </div>

      {byDate ? <Road goal={goal} story={roadStory(goal, data.entries, today)} /> : <Diary weeks={diaryWeeks(goal, data.entries, today, 2)} target={goal.target} unit={goal.unit} />}

      <p className="clay rounded-2xl bg-reward-soft px-4 py-3 font-display font-semibold text-ink [--lip:var(--color-reward)]">
        {run.days === 1 ? "1 day in a row" : `${run.days} days in a row`}
        {lastRest && <span className="font-sans text-sm font-bold text-muted"> · {formatShortDate(lastRest)} was a rest day~</span>}
      </p>

      <GoalActions goal={goal} today={today} />
    </div>
  );
}
