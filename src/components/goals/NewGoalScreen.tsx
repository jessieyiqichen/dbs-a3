"use client";

import { StorageNotice } from "@/components/ui/StorageNotice";
import { useStore } from "@/lib/store";
import { GoalForm } from "./GoalForm";

export function NewGoalScreen() {
  const state = useStore();
  if (state === null) return <p className="pt-6 text-muted">Loading…</p>;
  if (state.kind === "corrupt") return <StorageNotice state={state} />;
  return (
    <>
      {!state.persistent && <StorageNotice state={state} />}
      <GoalForm />
    </>
  );
}
