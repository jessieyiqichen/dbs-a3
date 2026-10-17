"use client";

import { useCallback, useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { Toast } from "@/components/ui/Toast";
import { addEntry, markVisited, removeEntry } from "@/lib/actions";
import { toISODate } from "@/lib/dates";
import { formatCount } from "@/lib/format";
import { sortByUrgency, type PlannedGoal } from "@/lib/quota";
import { getFocusGoal, getVisitStart, useStore } from "@/lib/store";
import { welcomeMessage } from "@/lib/welcome";
import type { Goal } from "@/lib/types";
import { FirstVisit } from "./FirstVisit";
import { GoalRow } from "./GoalRow";
import { NudgePrompt } from "./NudgePrompt";
import { TodayCard } from "./TodayCard";
import { WelcomeBanner } from "./WelcomeBanner";

/** A goal just created or edited goes first, unless it's already done for today. */
function pinFocused(items: PlannedGoal[], id: string | null): PlannedGoal[] {
  const index = items.findIndex((item) => item.goal.id === id && ["not-started", "started"].includes(item.plan.status));
  return index <= 0 ? items : [items[index], ...items.slice(0, index), ...items.slice(index + 1)];
}

interface Undoable {
  entryId: string;
  message: string;
}

export function TodayScreen() {
  const state = useStore();
  const [undoable, setUndoable] = useState<Undoable | null>(null);
  const closeToast = useCallback(() => setUndoable(null), []);
  const ready = state?.kind === "ready";

  // Remember this visit, and drop ?from=nudge so a refresh doesn't repeat the welcome.
  useEffect(() => {
    if (!ready) return;
    markVisited(toISODate(new Date()));
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
  }, [ready]);

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

  const { data } = state;
  const [first, ...rest] = pinFocused(sortByUrgency(data.goals, data.entries, today), getFocusGoal());
  const visit = getVisitStart();
  const welcome = first ? welcomeMessage({ ...visit, today, goal: first.goal, entries: data.entries }) : null;
  const loggedToday = data.entries.some((e) => e.date === today);
  const showNudgePrompt =
    !data.settings.nudgesSetUp && !data.settings.nudgePromptDismissed && (loggedToday || visit.prevVisit !== null);
  const firstDay = first !== undefined && first.goal.startDate === today && loggedToday;

  return (
    <>
      {!state.persistent && <StorageNotice state={state} />}
      {welcome && <WelcomeBanner message={welcome} />}
      {first ? (
        <>
          <TodayCard goal={first.goal} plan={first.plan} today={today} hour={now.getHours()} onLog={(n) => log(first.goal, n)} />
          {showNudgePrompt && <NudgePrompt firstDay={firstDay} />}
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
