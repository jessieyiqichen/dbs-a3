import type { ReactNode } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import type { HistoryRow } from "@/lib/progress";
import type { Goal } from "@/lib/types";
import { CatArt } from "./CatArt";
import { Confetti } from "./Confetti";

interface Props {
  /** Shown under the celebration: the moment something useful is done is when to ask. */
  prompt?: ReactNode;
  goal: Goal;
  doneToday: number;
  streakDays: number;
  week: HistoryRow[];
  next: Goal | null;
  onStartNext: () => void;
}

const DAY_DOT: Record<string, string> = {
  done: "bg-lip",
  rest: "bg-reward",
};

/** The reward, the moment today's number is reached: the whole screen turns soft mint, confetti falls once, Titi
 *  jumps for joy with hearts, and the streak shows how many days in a row. Everything else on this screen is quiet. */
export function DoneToday({ prompt, goal, doneToday, streakDays, week, next, onStartNext }: Props) {
  const days = [...week].reverse();
  return (
    <section aria-labelledby="done-title" className="relative flex flex-col items-center pt-4 text-center">
      <div aria-hidden="true" className="fixed inset-0 -z-10 bg-celebrate" />
      <Confetti />
      <CatArt mood="celebrate" effect="party" className="w-44" />
      <ScreenHeading id="done-title" className="mt-4 font-display text-4xl font-bold text-ink">Done for today!</ScreenHeading>
      <p className="mt-2 text-lg font-bold text-ink">
        {doneToday === 1 ? "1 fish treat" : `${doneToday} fish treats`} for Titi · {streakDays === 1 ? "1 day in a row" : `${streakDays} days in a row`}
      </p>
      <ol aria-label="Last 7 days" className="mt-5 flex gap-2">
        {days.map((d) => (
          <li key={d.date} className={`size-5 rounded-full ${d.amount > 0 ? DAY_DOT.done : DAY_DOT[d.kind] ?? "border-2 border-line bg-surface"}`}>
            <span className="sr-only">{d.date}: {d.amount > 0 ? `${d.amount} done` : d.kind}</span>
          </li>
        ))}
      </ol>
      {next ? (
        <div className="mt-10 flex w-full flex-col items-center gap-3">
          <Button size="lg" onClick={onStartNext} className="w-full">Next: {next.title} →</Button>
          <p className="font-bold text-muted">Or stop here, today counts~</p>
        </div>
      ) : (
        <ButtonLink href={`/goals/${goal.id}`} variant="secondary" className="mt-10">See your progress</ButtonLink>
      )}
      {prompt && <div className="mt-6 w-full text-left">{prompt}</div>}
    </section>
  );
}
