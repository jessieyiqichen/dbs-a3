"use client";

import { useCallback } from "react";
import { ProgressScreen } from "@/components/progress/ProgressScreen";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { Toast } from "@/components/ui/Toast";
import { restoreGoal } from "@/lib/actions";
import { toISODate } from "@/lib/dates";
import type { Removed } from "@/lib/goals";
import { planToday } from "@/lib/quota";
import { stashRemoved, useRemoved, useStore } from "@/lib/store";
import { useDesktop } from "@/lib/useDesktop";
import { BackupSection } from "./BackupSection";
import { GoalCard } from "./GoalCard";

const HEADER = (
  <PageHeader
    title="Your goals"
    intro="Tap one to see how it's going"
    back={null}
  />
);

interface Props {
  /** The goal to show beside the list on a desktop (its own page); the first goal when not given. */
  selected?: string;
  /** Came from Today, so the goal's back link returns there. */
  fromToday?: boolean;
}

/** Your goals as a list of cards; a goal just removed on its progress page can be put back from here. On a desktop the
 *  list is the left four columns and the chosen goal's progress the right eight, so Goals and a goal's page are one
 *  page (list and detail); on a phone the list opens each goal's own page. */
export function GoalsScreen({ selected, fromToday = false }: Props) {
  const state = useStore();
  const desktop = useDesktop();
  const removed: Removed | null = useRemoved();
  const closeToast = useCallback(() => stashRemoved(null), []);

  if (state === null)
    return (
      <>
        {HEADER}
        <p className="pt-6 text-muted">Loading your goals…</p>
      </>
    );
  if (state.kind === "corrupt")
    return (
      <>
        {HEADER}
        <StorageNotice state={state} />
      </>
    );

  const { data } = state;
  const today = toISODate(new Date());
  const chosen = desktop
    ? (data.goals.find((g) => g.id === selected) ?? data.goals[0] ?? null)
    : null;
  const list = (
    <>
      {HEADER}
      {!state.persistent && <StorageNotice state={state} />}
      {data.goals.length === 0 ? (
        <div className="mt-8 flex flex-col gap-4">
          <p className="text-lg font-bold text-ink">
            No goals yet, Titi is waiting
          </p>
          <ButtonLink href="/goals/new" className="self-start">
            Add a goal
          </ButtonLink>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {data.goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              plan={planToday(goal, data.entries, today)}
              today={today}
              selected={goal.id === chosen?.id}
            />
          ))}
        </ul>
      )}
      <ButtonLink
        href="/goals/new"
        variant="secondary"
        className="mt-5 self-start"
      >
        + Add a goal
      </ButtonLink>
    </>
  );
  // Settings, apart from the goals: when to nudge, and the backup. Under the list on a phone; on a desktop a row of its
  // own under the list and the chosen goal, so the two columns above it stay level (user, 2026-10-19)
  const settings = (
    <div className="mt-10 flex flex-col gap-2 border-t-2 border-wash-strong pt-5 lg:col-span-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
      <ButtonLink
        href="/reminders"
        variant="ghost"
        className="self-start lg:col-span-4 lg:justify-self-start"
      >
        Reminder times
      </ButtonLink>
      <div className="lg:col-span-8 lg:col-start-5">
        <BackupSection data={data} />
      </div>
    </div>
  );
  const toast = (
    <Toast
      message={removed ? `Removed ${removed.goal.title}` : null}
      onUndo={() => {
        if (removed) restoreGoal(removed);
        stashRemoved(null);
      }}
      onClose={closeToast}
    />
  );
  if (!chosen)
    return (
      <>
        {list}
        {settings}
        {toast}
      </>
    );
  return (
    <div className="grid grid-cols-12 items-start gap-x-8">
      <div className="col-span-4 flex flex-col">{list}</div>
      <div className="col-span-8 col-start-5 flex flex-col">
        <ProgressScreen id={chosen.id} fromToday={fromToday} embedded />
      </div>
      {settings}
      {toast}
    </div>
  );
}
