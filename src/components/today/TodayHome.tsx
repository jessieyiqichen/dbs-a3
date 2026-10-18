"use client";

import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import { nudgeLine } from "@/lib/nudges";
import { countOf, headline } from "@/lib/phrases";
import type { TodayPlan } from "@/lib/quota";
import type { BowlDay } from "@/lib/scene";
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
  /** Why today's number grew after missed days. */
  catchUp: string | null;
  /** The calendar file is running out. */
  notice: string | null;
  next: Goal | null;
  /** Every goal, for the switcher; the first is the one shown. */
  goals: { goal: Goal; done: boolean }[];
  onPick: (id: string) => void;
  corner?: React.ReactNode;
  onStart: () => void;
  onStartNext: () => void;
  /** True right after a log: Titi hops. */
  cheer?: boolean;
}

type Status = TodayPlan["status"];

function title(goal: Goal, plan: TodayPlan): string {
  switch (plan.status) {
    case "started":
      return `${plan.doneToday} done, ${plan.leftToday} to go!`;
    case "done":
      return "Done for today!";
    case "paused":
      return "Paused";
    case "complete":
      return "Goal reached!";
    // Progress first, then the push to keep going: encouraging, not a verdict
    case "deadline-passed":
      return plan.doneTotal > 0
        ? `${plan.doneTotal} of ${goal.target}, nice work!`
        : "Ready for a fresh start?";
    default:
      return headline(goal.verb, plan.quota, goal.unit);
  }
}

/** Titi in every state: asleep before you start or while paused, sitting with you otherwise, jumping when the goal is reached. */
function catFor(
  status: Status,
  cheer: boolean,
): { mood: CatMood; effect?: CatEffect } {
  if (status === "not-started" || status === "paused")
    return { mood: "sleep", effect: "zzz" };
  if (status === "complete") return { mood: "celebrate", effect: "party" };
  if (status === "done") return { mood: "idle", effect: "party" };
  return { mood: "idle", effect: cheer ? "hop" : undefined };
}

/** The whole goal in one quiet line; it opens the goal's progress page. */
function Road({ goal, plan }: { goal: Goal; plan: TodayPlan }) {
  const card =
    "clay clay-press flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 hover:bg-wash focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus";
  if (goal.type !== "by-date") {
    return (
      <Link
        href={`/goals/${goal.id}`}
        className={`${card} justify-center font-bold text-muted`}
      >
        {countOf(plan.doneTotal, goal.unit)} all time{" "}
        <span aria-hidden="true">→</span>
        <span className="sr-only">, see progress</span>
      </Link>
    );
  }
  const pct = Math.min(
    100,
    Math.round((plan.doneTotal / Math.max(goal.target, 1)) * 100),
  );
  return (
    <Link
      href={`/goals/${goal.id}`}
      className={card}
      aria-label={`Road to ${goal.target}: ${plan.doneTotal} done, see progress`}
    >
      <span className="font-display font-semibold text-ink">
        Road to {goal.target}
      </span>
      <div
        aria-hidden="true"
        className="h-3 flex-1 overflow-hidden rounded-full bg-wash-strong"
      >
        <div
          className="h-full rounded-full bg-reward shadow-[inset_0_2px_0_rgba(255,255,255,.5)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-extrabold tabular-nums text-muted">
        {plan.doneTotal} done
      </span>
    </Link>
  );
}

/** Which goal is up now: the person picks; the first tab is the one the app would pick on its own. */
function GoalTabs({
  goals,
  current,
  onPick,
}: {
  goals: { goal: Goal; done: boolean }[];
  current: string;
  onPick: (id: string) => void;
}) {
  const pill =
    "clay clay-press inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-4 font-display text-sm font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus";
  return (
    <nav
      aria-label="Up now"
      className="flex w-full gap-2 overflow-x-auto px-1 pb-2 pt-1 [scrollbar-width:none]"
    >
      {goals.map(({ goal, done }) => {
        const on = goal.id === current;
        return (
          <button
            key={goal.id}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(goal.id)}
            className={`${pill} ${on ? "bg-primary text-on-primary [--lip:var(--color-lip)]" : "bg-surface text-ink hover:bg-wash"}`}
          >
            {shortName(goal)}
            {done && <span aria-hidden="true">✓</span>}
            {done && <span className="sr-only">, done for today</span>}
          </button>
        );
      })}
      <Link
        href="/goals/new"
        className={`${pill} bg-surface text-muted hover:bg-wash`}
      >
        + Add
      </Link>
    </nav>
  );
}

/** "Connection requests" for a tab, from what the goal counts. */
function shortName(goal: Goal): string {
  const unit = goal.unit.trim() || goal.title;
  return unit.charAt(0).toUpperCase() + unit.slice(1);
}

/** Today: the window, Titi on her mat, which goal, one sentence and one button; this week's bowls on a shelf that stays at
 *  the foot of a phone screen while the room scrolls. */
export function TodayHome({
  goal,
  plan,
  today,
  hour,
  bowls,
  welcome,
  catchUp,
  notice,
  next,
  goals,
  onPick,
  corner,
  onStart,
  onStartNext,
  cheer = false,
}: Props) {
  const active = plan.status === "not-started" || plan.status === "started";
  const line =
    plan.status === "done"
      ? "Titi is so full! See you tomorrow~"
      : (welcome ?? nudgeLine(goal, plan, today, hour));
  const cat = {
    ...catFor(plan.status, cheer),
    key: cheer ? "cheer" : plan.status,
  };
  return (
    <section aria-labelledby={`goal-${goal.id}`} className="flex flex-col">
      <Room bowls={bowls} cat={cat} corner={corner}>
        <GoalTabs goals={goals} current={goal.id} onPick={onPick} />
        <div className="relative w-full px-1 pt-1">
          <ScreenHeading
            id={`goal-${goal.id}`}
            className="font-display text-2xl font-bold leading-tight text-ink [text-wrap:balance]"
          >
            {title(goal, plan)}
          </ScreenHeading>
          <p className="mt-1 font-bold text-muted">{line}</p>
          {catchUp && plan.status === "not-started" && (
            <p className="mt-1 text-sm font-bold text-muted">{catchUp}</p>
          )}
        </div>
        <div className="flex w-full flex-col gap-3">
          {active && (
            <Button size="lg" onClick={onStart} className="w-full">
              {plan.status === "started" ? "Keep going" : "Start"}
            </Button>
          )}
          {plan.status === "done" && next && (
            <Button size="lg" onClick={onStartNext} className="w-full">
              Next: {next.title} →
            </Button>
          )}
          {plan.status === "complete" && (
            <ButtonLink href="/goals/new" size="lg" className="w-full">
              Set the next goal
            </ButtonLink>
          )}
          {plan.status === "deadline-passed" && (
            <ButtonLink
              href={`/goals/${goal.id}/edit`}
              size="lg"
              className="w-full"
            >
              Pick a new date
            </ButtonLink>
          )}
          {plan.status === "paused" && (
            <ButtonLink
              href="/goals"
              variant="secondary"
              className="self-start"
            >
              Manage goals
            </ButtonLink>
          )}
          <Road goal={goal} plan={plan} />
        </div>
        {notice && (
          <Link
            href="/reminders"
            className="self-center text-sm font-bold text-muted underline decoration-2 underline-offset-4 hover:text-ink focus-visible:outline-3 focus-visible:outline-focus"
          >
            {notice}
          </Link>
        )}
      </Room>
    </section>
  );
}
