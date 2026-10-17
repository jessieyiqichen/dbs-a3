"use client";

import { useRouter } from "next/navigation";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { addGoal } from "@/lib/actions";
import { toISODate } from "@/lib/dates";
import { setFocusGoal, useStore } from "@/lib/store";
import { BLANK_DRAFT, GoalSetup } from "./GoalSetup";

export function NewGoalScreen() {
  const router = useRouter();
  const state = useStore();
  if (state === null) return <p className="pt-6 text-muted">Loading…</p>;
  if (state.kind === "corrupt") return <StorageNotice state={state} />;
  return (
    <div className="mt-8">
      {!state.persistent && <StorageNotice state={state} />}
      <GoalSetup
        initial={BLANK_DRAFT}
        fields="full"
        submitLabel="Add this goal"
        onSubmit={(values) => {
          setFocusGoal(addGoal(values, toISODate(new Date())).id);
          router.push("/");
        }}
      />
    </div>
  );
}
