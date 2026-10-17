"use client";

import { useCallback, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { Toast } from "@/components/ui/Toast";
import { addEntry, removeEntry } from "@/lib/actions";
import { toISODate } from "@/lib/dates";
import { formatCount } from "@/lib/format";
import { sortByUrgency } from "@/lib/quota";
import { useStore } from "@/lib/store";
import type { Goal } from "@/lib/types";
import { FirstVisit } from "./FirstVisit";
import { GoalRow } from "./GoalRow";
import { TodayCard } from "./TodayCard";

interface Undoable {
  entryId: string;
  message: string;
}

export function TodayScreen() {
  const state = useStore();
  const [undoable, setUndoable] = useState<Undoable | null>(null);
  const closeToast = useCallback(() => setUndoable(null), []);

  if (state === null) return <p className="pt-6 text-muted">Loading your goals…</p>;
  if (state.kind === "corrupt") return <StorageNotice state={state} />;

  const now = new Date();
  const today = toISODate(now);
  const log = (goal: Goal, amount: number) => {
    const entry = addEntry(goal.id, amount, today);
    setUndoable({ entryId: entry.id, message: `Added ${formatCount(amount, goal.unit)}` });
  };
  const undo = () => {
    if (undoable) removeEntry(undoable.entryId);
    setUndoable(null);
  };

  const [first, ...rest] = sortByUrgency(state.data.goals, state.data.entries, today);

  return (
    <>
      {!state.persistent && <StorageNotice state={state} />}
      {first ? (
        <>
          <TodayCard goal={first.goal} plan={first.plan} today={today} hour={now.getHours()} onLog={(n) => log(first.goal, n)} />
          <section aria-labelledby="also-today" className="mt-10 flex flex-col gap-3">
            <h2 id="also-today" className="text-sm font-semibold uppercase tracking-wide text-muted">
              {rest.length > 0 ? "Also today" : "Anything else you're putting off?"}
            </h2>
            {rest.length > 0 && (
              <ul className="flex flex-col gap-2">
                {rest.map((item) => (
                  <GoalRow key={item.goal.id} item={item} onLog={() => log(item.goal, 1)} />
                ))}
              </ul>
            )}
            <ButtonLink href="/goals/new" variant="ghost" className="self-start">
              + Add a goal
            </ButtonLink>
          </section>
        </>
      ) : (
        <FirstVisit />
      )}
      <Toast message={undoable?.message ?? null} onUndo={undo} onClose={closeToast} />
    </>
  );
}
