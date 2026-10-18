import { ShelfBowl } from "@/components/today/Room";
import { formatShortDate } from "@/lib/dates";
import type { BowlDay } from "@/lib/scene";

/** A daily goal as Titi's diary: the last weeks, one shelf each, a fish in every day this goal got something. */
export function Diary({ weeks, target, unit }: { weeks: BowlDay[][]; target: number; unit: string }) {
  const any = weeks.some((w) => w.some((b) => b.fill !== "empty"));
  if (!any) return <p className="flat rounded-2xl bg-surface px-5 py-6 text-center font-bold text-muted">No fish yet this week, one today starts it~</p>;
  return (
    <figure className="flex flex-col gap-3">
      {weeks.map((week) => (
        <div key={week[0].date} className="flat rounded-2xl bg-reward-soft px-3 pb-2 pt-2">
          <p className="mb-1 text-center text-xs font-extrabold text-muted">Week of {formatShortDate(week[0].date)}</p>
          <ol aria-label={`Week of ${formatShortDate(week[0].date)}`} className="flex items-end gap-1">
            {week.map((b) => <ShelfBowl key={b.date} bowl={b} label="day" />)}
          </ol>
        </div>
      ))}
      <figcaption className="text-center text-sm font-bold text-muted">A heaped bowl is a day with all {target} {unit}~</figcaption>
    </figure>
  );
}
