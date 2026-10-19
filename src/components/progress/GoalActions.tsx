"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { deleteGoal, pauseGoal, resumeGoal } from "@/lib/actions";
import { formatShortDate } from "@/lib/dates";
import { stashRemoved } from "@/lib/store";
import type { Goal } from "@/lib/types";

const PAUSE_OPTIONS = [
  { days: 3, label: "3 days" },
  { days: 7, label: "1 week" },
  { days: 14, label: "2 weeks" },
];

/** Edit, a break, or remove: removing happens right away and Goals offers Undo, so no "are you sure". */
export function GoalActions({ goal, today }: { goal: Goal; today: string }) {
  const router = useRouter();
  const [pausing, setPausing] = useState(false);
  const pause = goal.pauses.find((p) => p.from <= today && today <= p.to);

  function remove() {
    stashRemoved(deleteGoal(goal.id));
    router.push("/goals");
  }

  return (
    <section aria-label="This goal" className="flex flex-col gap-3 lg:h-full">
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={`/goals/${goal.id}/edit`} variant="secondary">Edit goal</ButtonLink>
        {pause ? (
          <Button variant="secondary" onClick={() => resumeGoal(goal.id, today)}>Back from the break</Button>
        ) : (
          <Button variant="secondary" aria-expanded={pausing} onClick={() => setPausing((v) => !v)}>Take a break</Button>
        )}
      </div>
      {pause && <p className="text-sm font-bold text-muted">Taking a break until {formatShortDate(pause.to)}, no nudges and nothing counts as behind~</p>}
      {pausing && !pause && (
        <div className="flex flex-col gap-3 px-1 py-2">
          <p className="font-bold text-ink">How long? No nudges, and it won&apos;t count as falling behind~</p>
          <div className="flex flex-wrap gap-2">
            {PAUSE_OPTIONS.map((o) => (
              <Button key={o.days} variant="secondary" onClick={() => { pauseGoal(goal.id, o.days, today); setPausing(false); }}>{o.label}</Button>
            ))}
            <Button variant="ghost" onClick={() => setPausing(false)}>Never mind</Button>
          </div>
        </div>
      )}
      {/* Kept apart from Edit and Take a break, at the bottom (of the side panel on a desktop), so it is hard to tap by mistake */}
      <div className="mt-6 border-t-2 border-wash-strong pt-4 lg:mt-auto">
        <Button variant="ghost" onClick={remove}>Remove goal</Button>
      </div>
    </section>
  );
}
