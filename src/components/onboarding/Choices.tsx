"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export interface Choice {
  key: string;
  label: string;
  /** A second line, e.g. "By Nov 17" or "150 connection requests". */
  detail?: string;
  /** Shown on the right instead of the arrow, e.g. fish treats per day. */
  aside?: ReactNode;
}

/** A list of answers; tapping one answers the question and moves on. */
export function Choices({ choices, label, onPick }: { choices: Choice[]; label: string; onPick: (key: string) => void }) {
  return (
    <ul aria-label={label} className="flex flex-col gap-3">
      {choices.map((c) => (
        <li key={c.key}>
          <Button variant="choice" size="lg" className="w-full py-2 text-left" onClick={() => onPick(c.key)}>
            <span className="flex flex-1 flex-col">
              {c.label}
              {c.detail && <span className="font-sans text-sm font-bold text-muted">{c.detail}</span>}
            </span>
            {c.aside ?? <span aria-hidden="true" className="text-muted">→</span>}
          </Button>
        </li>
      ))}
    </ul>
  );
}

/** Fish treats per day beside a choice, so each number is felt before it's picked. */
export function TreatsPerDay({ n }: { n: number }) {
  return (
    <span className="flex shrink-0 items-center gap-1 font-sans text-sm font-bold text-muted">
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative icon */}
      <img src="/cat/fish.png" alt="" aria-hidden="true" className="w-7" />
      {n} a day
    </span>
  );
}
