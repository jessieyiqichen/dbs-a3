import { Button, ButtonLink } from "@/components/ui/Button";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import { formatCount } from "@/lib/format";
import type { HistoryRow } from "@/lib/progress";
import type { Goal } from "@/lib/types";

interface Props {
  goal: Goal;
  doneToday: number;
  streakDays: number;
  week: HistoryRow[];
  next: Goal | null;
  onStartNext: () => void;
}

/** Make it satisfying: a visible reward the moment today's number is reached. */
export function DoneToday({ goal, doneToday, streakDays, week, next, onStartNext }: Props) {
  const days = [...week].reverse();
  return (
    <section aria-labelledby="done-title" className="flex flex-col items-center gap-4 pt-8 text-center">
      <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-primary text-3xl text-on-primary">✓</span>
      <div className="flex flex-col gap-1">
        <ScreenHeading id="done-title" className="text-4xl font-bold tracking-tight text-ink">Done for today</ScreenHeading>
        <p className="text-lg text-ink">
          {formatCount(doneToday, goal.unit)} · {streakDays === 1 ? "1 day in a row" : `${streakDays} days in a row`}
        </p>
      </div>
      <ol aria-label="Last 7 days" className="flex gap-2">
        {days.map((d) => (
          <li key={d.date} className={`size-4 rounded-full ${d.amount > 0 ? "bg-primary" : "border-2 border-line"}`}>
            <span className="sr-only">{d.date}: {d.amount > 0 ? `${d.amount} done` : d.kind}</span>
          </li>
        ))}
      </ol>
      {next ? (
        <div className="mt-2 flex w-full flex-col gap-2">
          <Button size="lg" onClick={onStartNext} className="w-full sm:w-auto sm:self-center">Next: {next.title} →</Button>
          <p className="text-sm text-muted">Or stop here for today. That counts.</p>
        </div>
      ) : (
        <ButtonLink href={`/goals/${goal.id}`} variant="secondary" className="mt-2">See your progress</ButtonLink>
      )}
    </section>
  );
}
