"use client";

import { useCallback, useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { Toast } from "@/components/ui/Toast";
import { addEntry, endSession, markVisited, removeEntry } from "@/lib/actions";
import { toISODate } from "@/lib/dates";
import { formatCount } from "@/lib/format";
import { history } from "@/lib/progress";
import { sortByUrgency, type PlannedGoal } from "@/lib/quota";
import { startGoal } from "@/lib/start";
import { getFocusGoal, getVisitStart, useStore } from "@/lib/store";
import { streak } from "@/lib/streak";
import type { AppData, Goal } from "@/lib/types";
import { welcomeMessage } from "@/lib/welcome";
import { AskHowMany } from "./AskHowMany";
import { DoneToday } from "./DoneToday";
import { FirstVisit } from "./FirstVisit";
import { GoalRow } from "./GoalRow";
import { NudgePrompt } from "./NudgePrompt";
import { TodayCard } from "./TodayCard";
import { WelcomeBanner } from "./WelcomeBanner";

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
  const welcome = welcomeMessage({ ...visit, today, goal: first.goal, entries: data.entries });
  const loggedToday = data.entries.some((e) => e.date === today);
  const { nudgesSetUp, nudgePromptDismissed, reminderTimes } = data.settings;
  const showPrompt = !nudgePromptDismissed && (promptPinned || (!nudgesSetUp && (loggedToday || visit.prevVisit !== null)));
  const firstDay = first.goal.startDate === today && loggedToday;
  const next = rest.find((item) => ACTIVE.has(item.plan.status))?.goal ?? null;

  return (
    <>
      {!state.persistent ? <StorageNotice state={state} /> : welcome && !asking && <WelcomeBanner message={welcome} />}

      {asking ? (
        <AskHowMany goal={first.goal} left={first.plan.leftToday} onLog={(n) => log(first.goal, n)} onNone={endSession} />
      ) : first.plan.status === "done" ? (
        <DoneToday
          goal={first.goal}
          doneToday={first.plan.doneToday}
          streakDays={streak(first.goal, data.entries, today).days}
          week={history(first.goal, data.entries, today, 7)}
          next={next}
          onStartNext={() => next && startGoal(next)}
        />
      ) : (
        <TodayCard goal={first.goal} plan={first.plan} today={today} hour={now.getHours()} onStart={() => startGoal(first.goal)} />
      )}

      {showPrompt && !asking && <NudgePrompt firstDay={firstDay} times={reminderTimes} onActed={() => setPromptPinned(true)} />}

      <section aria-labelledby="also-today" className="mt-10 flex flex-col gap-1">
        <h2 id="also-today" className="text-sm font-semibold uppercase tracking-wide text-muted">
          {rest.length > 0 ? "Also today" : "Anything else you're putting off?"}
        </h2>
        {rest.length > 0 && (
          <ul className="flex flex-col">
            {rest.map((item) => (
              <GoalRow key={item.goal.id} item={item} onStart={() => startGoal(item.goal)} />
            ))}
          </ul>
        )}
        <ButtonLink href="/goals/new" variant="ghost" className="mt-2 self-start">+ Add a goal</ButtonLink>
      </section>
      <Toast message={undoable?.message ?? null} onUndo={undo} onClose={closeToast} />
    </>
  );
}
