"use client";

import { Label } from "./Label";

export interface SwitchGoal {
  id: string;
  name: string;
  done: boolean;
}

export const goalPillClass =
  "clay clay-press inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-surface px-4 font-sans text-[0.8125rem] font-extrabold text-ink hover:bg-wash " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus";

/** Which goal the sentence below is about. The current goal is a Label (it cannot be pressed: you are already on it);
 *  the other goals, if any, are pills you can press to switch. One goal shows just its name. */
export function GoalSwitch({ goals, current, onPick }: { goals: SwitchGoal[]; current: string; onPick: (id: string) => void }) {
  const now = goals.find((g) => g.id === current) ?? goals[0];
  const others = goals.filter((g) => g.id !== now.id);
  if (others.length === 0) return <Label>{now.name}</Label>;
  return (
    <nav aria-label="Goals for today" className="flex w-full flex-wrap items-center gap-x-3 gap-y-2">
      <Label as="span">
        <span aria-current="true">{now.name}</span>
      </Label>
      <span aria-hidden="true" className="t-label text-line">·</span>
      {others.map((g) => (
        <button key={g.id} type="button" onClick={() => onPick(g.id)} className={goalPillClass}>
          {g.name}
          {g.done && <span aria-hidden="true">✓</span>}
          {g.done && <span className="sr-only">, done for today</span>}
        </button>
      ))}
    </nav>
  );
}
