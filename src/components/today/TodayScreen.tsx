"use client";

import { useCallback, useEffect, useState } from "react";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { Toast } from "@/components/ui/Toast";
import { addEntry, endSession, markVisited, removeEntry } from "@/lib/actions";
import { toISODate } from "@/lib/dates";
import { formatCount } from "@/lib/format";
import { sortByUrgency, type PlannedGoal } from "@/lib/quota";
import { startGoal } from "@/lib/start";
import { getFocusGoal, getVisitStart, setFocusGoal, useStore } from "@/lib/store";
import { calendarNotice, catchUpLine, sessionIsToday } from "@/lib/returning";
import { weekBowls } from "@/lib/scene";
import { overallStreak } from "@/lib/streak";
import type { AppData, Goal } from "@/lib/types";
import { weekSummary, welcomeMessage } from "@/lib/welcome";
import { bowlFill, milestoneLine } from "@/lib/session";
import { RoomSkeleton } from "./Room";
import { DoneToday } from "./DoneToday";
import { FirstVisit } from "./FirstVisit";
import { NudgePrompt } from "./NudgePrompt";
import { Session } from "./Session";
import { TodayHome } from "./TodayHome";
import { StreakChip } from "./StreakChip";

interface Undoable {
  entryId: string;
  message: string;
}

const ACTIVE = new Set(["not-started", "started"]);

/** The goal in a session goes first, then the one the person picked or just created, then the most urgent. */
function pickFirst(items: PlannedGoal[], data: AppData, picked: string | null): PlannedGoal[] {
  const pinned = data.session?.goalId ?? picked ?? getFocusGoal();
  const index = items.findIndex((item) => item.goal.id === pinned && (data.session || picked === item.goal.id || ACTIVE.has(item.plan.status) || item.plan.status === "done"));
  return index <= 0 ? items : [items[index], ...items.slice(0, index), ...items.slice(index + 1)];
}

export function TodayScreen() {
  const state = useStore();
  const [undoable, setUndoable] = useState<Undoable | null>(null);
  const [promptPinned, setPromptPinned] = useState(false);
  // The goal whose number was just reached in this visit: the celebration shows once, then Titi's room again.
  const [justDone, setJustDone] = useState<string | null>(null);
  // The goal the person tapped in the switcher; remembered while the app stays open.
  const [picked, setPicked] = useState<string | null>(() => getFocusGoal());
  const closeToast = useCallback(() => setUndoable(null), []);
  const ready = state?.kind === "ready";

  // Remember this visit, and drop ?from=nudge so a refresh doesn't repeat the welcome.
  useEffect(() => {
    if (!ready) return;
    markVisited(toISODate(new Date()));
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
  }, [ready]);

  if (state === null) return <RoomSkeleton />;
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

  const planned = pickFirst(sortByUrgency(data.goals, data.entries, today), data, picked);
  const [first, ...rest] = planned;
  const asking = data.session?.goalId === first.goal.id && sessionIsToday(data.session, today) && ACTIVE.has(first.plan.status);
  const visit = getVisitStart();
  const welcome = weekSummary(data.goals, data.entries, today, visit.prevVisit) ?? welcomeMessage({ ...visit, today, goals: data.goals, entries: data.entries });
  const firstTime = data.entries.length === 0;
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
          bowl={bowlFill(first.plan.doneToday, first.plan.quota)}
          firstTime={firstTime}
          onLog={(n) => log(first.goal, n, first.plan.doneToday + n >= first.plan.quota)}
          onOpen={() => first.goal.link && window.open(first.goal.link, "_blank", "noopener,noreferrer")}
          onStop={() => { endSession(); closeToast(); }}
        />
      ) : first.plan.status === "done" && justDone === first.goal.id ? (
        <DoneToday
          prompt={showPrompt ? <NudgePrompt times={reminderTimes} onActed={() => setPromptPinned(true)} /> : null}
          goal={first.goal}
          doneToday={first.plan.doneToday}
          doneTotal={first.plan.doneTotal}
          streakDays={run}
          milestone={milestoneLine(first.goal, first.plan.doneTotal, first.plan.doneToday)}
          next={next}
          onStartNext={() => { setJustDone(null); closeToast(); if (next) startGoal(next); }}
          onContinue={() => { setJustDone(null); closeToast(); }}
        />
      ) : (
        <TodayHome
          goal={first.goal}
          plan={first.plan}
          today={today}
          hour={now.getHours()}
          bowls={weekBowls(data.goals, data.entries, today)}
          welcome={welcome}
          catchUp={catchUpLine(first.plan)}
          notice={calendarNotice(data.settings.calendarUntil, today)}
          next={next}
          goals={planned.map((item) => ({ goal: item.goal, done: item.plan.status === "done" || item.plan.status === "complete" }))}
          onPick={(id) => { setFocusGoal(id); setPicked(id); }}
          corner={run > 0 ? <StreakChip days={run} /> : undefined}
          // Asked only once today's number is reached, never while there is still work to do
          prompt={showPrompt && !firstTime && first.plan.status === "done" ? <NudgePrompt times={reminderTimes} onActed={() => setPromptPinned(true)} /> : null}
          onStart={() => startGoal(first.goal)}
          onStartNext={() => next && startGoal(next)}
          cheer={undoable !== null}
        />
      )}

      <Toast message={undoable?.message ?? null} onUndo={undo} onClose={closeToast} />
    </>
  );
}
