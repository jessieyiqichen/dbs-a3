"use client";

import { useCallback, useEffect, useState } from "react";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { Toast } from "@/components/ui/Toast";
import { addEntry, endSession, markVisited, removeEntry } from "@/lib/actions";
import { toISODate } from "@/lib/dates";
import { formatCount } from "@/lib/format";
import { sortByUrgency, type PlannedGoal } from "@/lib/quota";
import { startGoal } from "@/lib/start";
import { getFocusGoal, getVisitStart, useStore } from "@/lib/store";
import { overallStreak, overallWeek } from "@/lib/streak";
import type { AppData, Goal } from "@/lib/types";
import { welcomeMessage } from "@/lib/welcome";
import { AskHowMany } from "./AskHowMany";
import { DoneToday } from "./DoneToday";
import { FirstVisit } from "./FirstVisit";
import { GoalRow } from "./GoalRow";
import { NudgePrompt } from "./NudgePrompt";
import { TodayCard } from "./TodayCard";
import { WelcomeBanner } from "./WelcomeBanner";
import { StreakChip } from "./StreakChip";

interface Undoable {
  entryId: string;
  message: string;
}

const ACTIVE = new Set(["not-started", "started"]);

/** The goal in a session goes first, then one just created or started, then the most urgent. */
function pickFirst(items: PlannedGoal[], data: AppData): PlannedGoal[] {
  const pinned = data.session?.goalId ?? getFocusGoal();
  const index = items.findIndex((item) => item.goal.id === pinned && (data.session || ACTIVE.has(item.plan.status) || item.plan.status === "done"));
  return index <= 0 ? items : [items[index], ...items.slice(0, index), ...items.slice(index + 1)];
}

export function TodayScreen() {
  const state = useStore();
  const [undoable, setUndoable] = useState<Undoable | null>(null);
  const [promptPinned, setPromptPinned] = useState(false);
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

  const { data } = state;
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

  if (data.goals.length === 0) {
    return (
      <>
        {!state.persistent && <StorageNotice state={state} />}
        <FirstVisit />
      </>
    );
  }

  const [first, ...rest] = pickFirst(sortByUrgency(data.goals, data.entries, today), data);
  const asking = data.session?.goalId === first.goal.id;
  const visit = getVisitStart();
  const welcome = welcomeMessage({ ...visit, today, goals: data.goals, entries: data.entries });
  const { nudgesSetUp, nudgePromptDismissed, reminderTimes } = data.settings;
  const showPrompt = !nudgePromptDismissed && (promptPinned || !nudgesSetUp);
  const next = rest.find((item) => ACTIVE.has(item.plan.status))?.goal ?? null;
  const run = overallStreak(data.goals, data.entries, today).days;

  return (
    <>
      {run > 0 && <StreakChip days={run} />}
      {!state.persistent ? <StorageNotice state={state} /> : welcome && !asking && <WelcomeBanner message={welcome} />}

      {asking ? (
        <AskHowMany goal={first.goal} total={first.plan.quota} done={first.plan.doneToday} onLog={(n) => log(first.goal, n)} onNone={endSession} />
      ) : first.plan.status === "done" ? (
        <DoneToday
          prompt={showPrompt ? <NudgePrompt times={reminderTimes} onActed={() => setPromptPinned(true)} /> : null}
          goal={first.goal}
          doneToday={first.plan.doneToday}
          streakDays={run}
          week={overallWeek(data.goals, data.entries, today)}
          next={next}
          onStartNext={() => next && startGoal(next)}
        />
      ) : (
        <TodayCard goal={first.goal} plan={first.plan} today={today} hour={now.getHours()} onStart={() => startGoal(first.goal)} cheer={undoable !== null} />
      )}

      {rest.length > 0 && !asking && (
        <section aria-labelledby="also-today" className="mt-12 flex flex-col">
          <h2 id="also-today" className="font-display text-lg font-semibold text-muted">Also today</h2>
          <ul className="flex flex-col">
            {rest.map((item) => (
              <GoalRow key={item.goal.id} item={item} onStart={() => startGoal(item.goal)} />
            ))}
          </ul>
        </section>
      )}
      <Toast message={undoable?.message ?? null} onUndo={undo} onClose={closeToast} />
    </>
  );
}
