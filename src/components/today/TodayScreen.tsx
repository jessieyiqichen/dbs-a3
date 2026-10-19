"use client";

import { useRouter } from "next/navigation";
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
import { backAfterDays, weekSummary, welcomeMessage } from "@/lib/welcome";
import { milestoneLine } from "@/lib/session";
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

/** Is the first goal's session live today, and is its celebration due? Shared by the page and the leave-session check. */
function sessionState(data: AppData, picked: string | null, justDone: string | null, today: string) {
  const planned = pickFirst(sortByUrgency(data.goals, data.entries, today), data, picked);
  const first = planned[0];
  const asking = data.session?.goalId === first.goal.id && sessionIsToday(data.session, today) && ACTIVE.has(first.plan.status);
  const celebrating = first.plan.status === "done" && justDone === first.goal.id;
  return { planned, asking, celebrating };
}

/** Today ("/") is Titi's room; the session ("/session") is its own page, so Back returns to the room and the session is
 *  kept for the day. The two views share this component because they share the goal order, the toast and the undo. */
export function TodayScreen({ view = "home" }: { view?: "home" | "session" }) {
  const router = useRouter();
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

  // /session with nothing in progress (opened directly, or the session is over) goes back to Today.
  useEffect(() => {
    if (view !== "session" || state?.kind !== "ready") return;
    const { data } = state;
    if (data.goals.length === 0) return router.replace("/");
    const { asking, celebrating } = sessionState(data, picked, justDone, toISODate(new Date()));
    if (!asking && !celebrating) router.replace("/");
  }, [view, state, picked, justDone, router]);

  if (state === null) return <RoomSkeleton />;
  if (state.kind === "corrupt") return <StorageNotice state={state} />;

  const { data } = state;
  const now = new Date();
  const today = toISODate(now);
  const log = (goal: Goal, amount: number, reachesQuota: boolean) => {
    const entry = addEntry(goal.id, amount, today);
    if (reachesQuota) {
      endSession();
      setJustDone(goal.id); // today's number is reached: the celebration is the confirmation, so no toast over it
      setUndoable(null);
      return;
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

  const { planned, asking, celebrating } = sessionState(data, picked, justDone, today);
  const [first, ...rest] = planned;
  const begin = (goal: Goal) => {
    // Follow the goal being started, so its own done screen shows when it is finished
    setPicked(goal.id);
    startGoal(goal);
    router.push("/session");
  };
  const visit = getVisitStart();
  const welcome = weekSummary(data.goals, data.entries, today, visit.prevVisit) ?? welcomeMessage({ ...visit, today, goals: data.goals, entries: data.entries });
  const back = backAfterDays({ prevVisit: visit.prevVisit, today, goals: data.goals, entries: data.entries });
  const firstTime = data.entries.length === 0;
  const { nudgesSetUp, nudgePromptDismissed, reminderTimes } = data.settings;
  const showPrompt = !nudgePromptDismissed && (promptPinned || !nudgesSetUp);
  const next = rest.find((item) => ACTIVE.has(item.plan.status))?.goal ?? null;
  const run = overallStreak(data.goals, data.entries, today).days;

  return (
    <>
      {!state.persistent && <StorageNotice state={state} />}

      {view === "session" ? (
        asking ? (
          <Session
            goal={first.goal}
            total={first.plan.quota}
            done={first.plan.doneToday}
            firstTime={firstTime}
            onLog={(n) => log(first.goal, n, first.plan.doneToday + n >= first.plan.quota)}
            onOpen={() => first.goal.link && window.open(first.goal.link, "_blank", "noopener,noreferrer")}
          />
        ) : celebrating ? (
          <DoneToday
            prompt={showPrompt ? <NudgePrompt times={reminderTimes} onActed={() => setPromptPinned(true)} /> : null}
            goal={first.goal}
            doneToday={first.plan.doneToday}
            doneTotal={first.plan.doneTotal}
            streakDays={run}
            milestone={milestoneLine(first.goal, first.plan.doneTotal, first.plan.doneToday)}
            next={next}
            onStartNext={() => { setJustDone(null); closeToast(); if (next) { setPicked(next.id); startGoal(next); } }}
            onContinue={() => { setJustDone(null); closeToast(); router.push("/"); }}
            bowls={weekBowls(data.goals, data.entries, today)}
            // The streak's own moment only on the day's first finished goal, so later ones are not slowed down
            streakMoment={rest.every((item) => item.plan.status !== "done" && item.plan.status !== "complete")}
          />
        ) : null /* nothing in progress: the effect above is sending you to Today */
      ) : (
        <TodayHome
          goal={first.goal}
          plan={first.plan}
          today={today}
          hour={now.getHours()}
          bowls={weekBowls(data.goals, data.entries, today)}
          welcome={welcome}
          back={back}
          catchUp={catchUpLine(first.plan)}
          notice={calendarNotice(data.settings.calendarUntil, today)}
          next={next}
          goals={planned.map((item) => ({ goal: item.goal, done: item.plan.status === "done" || item.plan.status === "complete" }))}
          onPick={(id) => { setFocusGoal(id); setPicked(id); }}
          corner={run > 0 ? <StreakChip days={run} /> : undefined}
          onStart={() => begin(first.goal)}
          onStartNext={() => next && begin(next)}
          cheer={undoable !== null}
        />
      )}

      {/* On the home view the week's shelf holds the foot of a phone screen, so the toast floats above it */}
      <Toast message={undoable?.message ?? null} onUndo={undo} onClose={closeToast} raised={view === "home"} />
    </>
  );
}
