"use client";

import { ButtonLink } from "@/components/ui/Button";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { useStore } from "@/lib/store";
import { GoalForm } from "./GoalForm";

export function EditGoalScreen({ id }: { id: string }) {
  const state = useStore();
  if (state === null) return <p className="pt-6 text-muted">Loading your goal…</p>;
  if (state.kind === "corrupt") return <StorageNotice state={state} />;

  const goal = state.data.goals.find((g) => g.id === id);
  if (!goal) {
    return (
      <div className="mt-8 flex flex-col gap-4">
        <p className="text-lg text-ink">This goal isn&apos;t saved on this device. It may have been deleted.</p>
        <ButtonLink href="/" className="self-start">Go to Today</ButtonLink>
      </div>
    );
  }
  return <GoalForm goal={goal} />;
}
