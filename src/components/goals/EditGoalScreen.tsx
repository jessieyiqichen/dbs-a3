"use client";

import { useRouter } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { updateGoal } from "@/lib/actions";
import { useStore } from "@/lib/store";
import { draftFromGoal, GoalSetup } from "./GoalSetup";

export function EditGoalScreen({ id }: { id: string }) {
  const router = useRouter();
  const state = useStore();
  if (state === null) return <p className="pt-6 text-muted">Loading your goal…</p>;
  if (state.kind === "corrupt") return <StorageNotice state={state} />;

  const goal = state.data.goals.find((g) => g.id === id);
  if (!goal) {
    return (
      <div className="mt-8 flex flex-col gap-4">
        <p className="text-lg font-bold text-ink">This goal isn&apos;t saved on this device, it may have been deleted~</p>
        <ButtonLink href="/goals" className="self-start">See your goals</ButtonLink>
      </div>
    );
  }
  return (
    <div className="mt-8">
      <GoalSetup
        initial={draftFromGoal(goal)}
        fields="full"
        submitLabel="Save changes"
        onSubmit={(values) => {
          updateGoal(goal.id, values);
          router.push(`/goals/${goal.id}`);
        }}
      />
    </div>
  );
}
