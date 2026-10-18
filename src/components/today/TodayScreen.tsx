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
import { weekBowls } from "@/lib/scene";
import { overallStreak } from "@/lib/streak";
import type { AppData, Goal } from "@/lib/types";
import { welcomeMessage } from "@/lib/welcome";
import { DoneToday } from "./DoneToday";
import { FirstVisit } from "./FirstVisit";
import { GoalRow } from "./GoalRow";
import { NudgePrompt } from "./NudgePrompt";
import { Session } from "./Session";
import { TodayHome } from "./TodayHome";
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
  // The goal whose number was just reached in this visit: the celebration shows once, then Titi's room again.
  const [justDone, setJustDone] = useState<string | null>(null);
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
  const log = (goal: Goal, amount: number, reachesQuota: boolean) => {
    const entry = addEntry(goal.id, amount, today);
    if (reachesQuota) {
      endSession();
      setJustDone(goal.id); // today's number is reached: on to the celebration
    }
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
  const asking = data.session?.goalId === first.goal.id && ACTIVE.has(first.plan.status);
  const visit = getVisitStart();
  const welcome = welcomeMessage({ ...visit, today, goals: data.goals, entries: data.entries });
  const { nudgesSetUp, nudgePromptDismissed, reminderTimes } = data.settings;
  const showPrompt = !nudgePromptDismissed && (promptPinned || !nudgesSetUp);
  const next = rest.find((item) => ACTIVE.has(item.plan.status))?.goal ?? null;
  const run = overallStreak(data.goals, data.entries, today).days;

  return (
    <>
      {!state.persistent && <StorageNotice state={state} />}

      {asking ? (
        <Session
          goal={first.goal}
          total={first.plan.quota}
          done={first.plan.doneToday}
          onLog={(n) => log(first.goal, n, first.plan.doneToday + n >= first.plan.quota)}
          onOpen={() => first.goal.link && window.open(first.goal.link, "_blank", "noopener,noreferrer")}
          onStop={endSession}
        />
      ) : first.plan.status === "done" && justDone === first.goal.id ? (
        <DoneToday
          prompt={showPrompt ? <NudgePrompt times={reminderTimes} onActed={() => setPromptPinned(true)} /> : null}
          goal={first.goal}
          doneToday={first.plan.doneToday}
          doneTotal={first.plan.doneTotal}
          streakDays={run}
          next={next}
          onStartNext={() => { setJustDone(null); if (next) startGoal(next); }}
          onContinue={() => setJustDone(null)}
        />
      ) : (
        <TodayHome
          goal={first.goal}
          plan={first.plan}
          today={today}
          hour={now.getHours()}
          bowls={weekBowls(data.goals, data.entries, today)}
          welcome={welcome}
          next={next}
          corner={run > 0 ? <StreakChip days={run} /> : undefined}
          onStart={() => startGoal(first.goal)}
          onStartNext={() => next && startGoal(next)}
          cheer={undoable !== null}
        />
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
