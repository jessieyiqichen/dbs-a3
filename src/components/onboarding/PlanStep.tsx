"use client";

import { Coins } from "@/components/today/Coins";
import { CatArt } from "@/components/today/CatArt";
import { Button } from "@/components/ui/Button";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import { formatShortDate } from "@/lib/dates";
import { countOf, headline } from "@/lib/phrases";
import { hostOf } from "@/lib/start";
import type { GoalValues } from "@/lib/validate";

interface Props {
  goal: GoalValues;
  perDay: number;
  onBack: () => void;
  onStart: () => void;
}

/** The end of setup: today's plan as fish treats, the whole goal in one quiet line, and the first task right away. */
export function PlanStep({ goal, perDay, onBack, onStart }: Props) {
  const host = hostOf(goal.link);
  const whole = `${countOf(goal.target, goal.unit)} ${goal.deadline ? `by ${formatShortDate(goal.deadline)}` : "every day"}`;
  return (
    <section aria-labelledby="plan-title" className="relative flex flex-col items-center pt-1 text-center">
      <div aria-hidden="true" className="fixed inset-0 -z-10 bg-celebrate" />
      <div className="flex w-full items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="-ml-2 inline-flex size-11 items-center justify-center rounded-full font-display text-2xl text-muted hover:bg-surface focus-visible:outline-3 focus-visible:outline-focus"
        >
          ←
        </button>
        <div aria-hidden="true" className="h-2.5 flex-1 rounded-full bg-lip" />
      </div>
      <CatArt mood="celebrate" effect="party" className="mt-2 w-40" />
      <ScreenHeading id="plan-title" className="mt-3 font-display text-3xl font-bold text-ink">Here&apos;s our plan!</ScreenHeading>
      <p className="mt-1 text-lg font-bold text-muted">{headline(goal.verb, perDay, goal.unit)} today</p>
      <div className="mt-5 self-center">
        <Coins total={perDay} done={0} label="Today" />
      </div>
      <p className="mt-1 font-bold text-muted">Each one is a fish treat for Titi~</p>
      <div className="mt-6 w-full rounded-2xl bg-surface px-4 py-3 text-left shadow-[0_2px_12px_rgba(61,59,51,.08)]">
        <p className="font-bold text-ink">{whole}</p>
        <p className="text-sm font-bold text-muted">You can change this anytime in Goals~</p>
      </div>
      <Button size="lg" className="mt-8 w-full" onClick={onStart}>
        Start my first one
        {host && (
          <>
            <span aria-hidden="true">↗</span>
            <span className="sr-only">(opens {host} in a new tab)</span>
          </>
        )}
      </Button>
      <p className="mt-2 text-sm text-muted">{host ? `Opens ${host}, then come back and tell Titi how many~` : "Go do one, then come back and tell Titi how many~"}</p>
    </section>
  );
}
