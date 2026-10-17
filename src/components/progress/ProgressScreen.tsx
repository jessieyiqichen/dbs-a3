"use client";

import { ButtonLink } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { formatShortDate, toISODate } from "@/lib/dates";
import { formatCount } from "@/lib/format";
import { cumulativeSeries, history, type DayKind } from "@/lib/progress";
import { planToday } from "@/lib/quota";
import { useStore } from "@/lib/store";
import { streak } from "@/lib/streak";
import { CumulativeChart } from "./CumulativeChart";
import { DailyBars } from "./DailyBars";

const KIND_TEXT: Record<DayKind, string> = {
  today: "today, not started yet",
  done: "",
  rest: "rest day",
  paused: "paused",
  missed: "missed",
};

export function ProgressScreen({ id }: { id: string }) {
  const state = useStore();
  if (state === null) return <p className="pt-6 text-muted">Loading your progress…</p>;
  if (state.kind === "corrupt") return <StorageNotice state={state} />;

  const { data } = state;
  const goal = data.goals.find((g) => g.id === id);
  if (!goal) {
    return (
      <div className="mt-8 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-ink">Goal not found</h2>
        <p className="text-lg text-ink">This goal isn&apos;t saved on this device. It may have been deleted.</p>
        <ButtonLink href="/goals" className="self-start">See your goals</ButtonLink>
      </div>
    );
  }

  const today = toISODate(new Date());
  const plan = planToday(goal, data.entries, today);
  const run = streak(goal, data.entries, today);
  const rows = history(goal, data.entries, today, 14);
  const lastRest = run.restDays[0];

  return (
    <div className="flex flex-col gap-8 pt-4">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">{goal.title}</p>
        {goal.type === "by-date" ? (
          <>
            <h2 className="text-4xl font-bold tracking-tight text-ink">
              {plan.doneTotal} of {formatCount(goal.target, goal.unit)}
            </h2>
            <ProgressBar value={plan.doneTotal} max={goal.target} label={`${goal.title} progress`} />
            <p className="text-ink">
              {plan.behindBy > 0
                ? `${plan.behindBy} behind plan. It's spread over the ${plan.daysLeft} days left, so today is ${formatCount(plan.quota, goal.unit)}.`
                : `On plan. ${plan.daysLeft} days left until ${formatShortDate(goal.deadline ?? today)}.`}
            </p>
          </>
        ) : (
          <h2 className="text-4xl font-bold tracking-tight text-ink">{formatCount(goal.target, goal.unit)} a day</h2>
        )}
      </div>

      {goal.type === "by-date" ? (
        <CumulativeChart {...cumulativeSeries(goal, data.entries, today)} unit={goal.unit} />
      ) : (
        <DailyBars rows={rows} target={goal.target} unit={goal.unit} />
      )}

      <p className="text-lg font-semibold text-ink">
        {run.days === 1 ? "1 day in a row" : `${run.days} days in a row`}
        {lastRest && <span className="font-normal text-muted"> · {formatShortDate(lastRest)} was a rest day</span>}
      </p>

      <section aria-labelledby="history-title" className="flex flex-col gap-2">
        <h3 id="history-title" className="text-xl font-bold text-ink">Last 14 days</h3>
        <table className="w-full text-left">
          <thead className="sr-only">
            <tr><th scope="col">Day</th><th scope="col">Done</th><th scope="col">Note</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.date} className="border-b border-wash-strong">
                <th scope="row" className="py-2 font-normal text-muted">{formatShortDate(row.date)}</th>
                <td className="py-2 font-semibold text-ink">{row.amount > 0 ? row.amount : "—"}</td>
                <td className="py-2 text-sm text-muted">{KIND_TEXT[row.kind]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/">Back to today&apos;s number</ButtonLink>
        <ButtonLink href={`/goals/${goal.id}/edit`} variant="ghost">Edit goal</ButtonLink>
      </div>
    </div>
  );
}
