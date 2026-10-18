"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import { doneStats, type DoneStat } from "@/lib/session";
import type { Goal } from "@/lib/types";
import { useCountUp } from "@/lib/useCountUp";
import { CatArt } from "./CatArt";

interface Props {
  /** Shown under the celebration: the moment something useful is done is when to ask. */
  prompt?: ReactNode;
  goal: Goal;
  doneToday: number;
  doneTotal: number;
  streakDays: number;
  /** "Halfway there!" when today crossed a quarter of the road. */
  milestone?: string | null;
  next: Goal | null;
  onStartNext: () => void;
  /** Back to Titi's room. */
  onContinue: () => void;
}

const CARD_TINT = [
  "bg-reward-soft text-reward-deep",
  "bg-primary-soft text-lip",
  "bg-[#e4f1fb] text-sky-deep",
];

/** One of the three result cards: it pops in after the one before it and its number counts up. */
function StatCard({ stat, index }: { stat: DoneStat; index: number }) {
  const shown = useCountUp(stat.value, 350 + index * 150);
  return (
    <li className={`card-in flat flex flex-1 flex-col items-center rounded-2xl px-2 py-3 ${CARD_TINT[index]}`} style={{ ["--delay" as string]: `${0.2 + index * 0.15}s` }}>
      <span className="text-xs font-extrabold text-muted">{stat.label}</span>
      <span aria-hidden="true" className="mt-1 font-display text-2xl font-semibold tabular-nums">{shown}{stat.suffix}</span>
      <span className="sr-only">{stat.value}{stat.suffix}</span>
    </li>
  );
}

/** The reward when today's number is reached, like a lesson-complete screen: Titi jumps for joy, confetti falls once,
 *  three cards pop in with today's fish, the streak and the road so far, then one button on to what's next. */
export function DoneToday({ prompt, goal, doneToday, doneTotal, streakDays, milestone = null, next, onStartNext, onContinue }: Props) {
  const stats = doneStats(goal, { doneToday, doneTotal, streakDays });
  return (
    <section aria-labelledby="done-title" className="relative flex flex-col items-center pt-2 text-center">
      <div aria-hidden="true" className="fixed inset-0 -z-10 bg-celebrate" />
      <CatArt mood="celebrate" effect="party" className="pop-in w-44" />
      <ScreenHeading id="done-title" className="mt-3 font-display text-4xl font-bold text-ink">Done for today!</ScreenHeading>
      <ul aria-label="Today's results" className="mt-5 flex w-full gap-3">
        {stats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
      </ul>
      {milestone && <p className="card-in mt-5 font-display text-xl font-semibold text-ink" style={{ ["--delay" as string]: "0.8s" }}>{milestone}</p>}
      <p className={`${milestone ? "mt-1" : "mt-5"} font-bold text-muted`}>Titi is so full! See you tomorrow~</p>
      <div className="mt-8 flex w-full flex-col items-center gap-3">
        {next ? (
          <>
            <Button size="lg" onClick={onStartNext} className="w-full">Next: {next.title} →</Button>
            <Button variant="ghost" onClick={onContinue}>Or stop here, today counts~</Button>
          </>
        ) : (
          <Button size="lg" onClick={onContinue} className="w-full">Back to Titi&apos;s room</Button>
        )}
      </div>
      {prompt && <div className="mt-6 w-full text-left">{prompt}</div>}
    </section>
  );
}
