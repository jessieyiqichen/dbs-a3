"use client";

import type { ReactNode } from "react";
import { CatArt } from "@/components/today/CatArt";
import { ScreenHeading } from "@/components/ui/ScreenHeading";

interface Props {
  /** 0-based position in this person's path, and how many steps the path has. */
  step: number;
  steps: number;
  /** Titi's question, the screen's h1. */
  question: string;
  headingId: string;
  /** False on the very first screen of a page load, so focus starts at the skip link as usual. */
  moveFocus: boolean;
  onBack?: () => void;
  children: ReactNode;
}

/** One question per screen, Duolingo style: a progress bar with Back, Titi asking in a speech bubble, then the answers. */
export function SetupFrame({ step, steps, question, headingId, moveFocus, onBack, children }: Props) {
  const heading = "font-display text-xl font-semibold leading-snug text-ink";
  return (
    <section aria-labelledby={headingId} className="flex flex-col pt-1">
      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="-ml-1 inline-flex min-h-11 items-center px-1 text-sm font-semibold text-muted underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-focus"
          >
            ← Back
          </button>
        ) : (
          <span aria-hidden="true" />
        )}
        {/* Which step this is, in words; the bar below only shows the share (reviewer, 2026-10-18) */}
        <span className="text-sm font-bold text-muted tabular-nums">Step {step + 1} of {steps}</span>
      </div>
      <div
        role="progressbar"
        aria-label="Setup"
        aria-valuemin={1}
        aria-valuemax={steps}
        aria-valuenow={step + 1}
        aria-valuetext={`Step ${step + 1} of ${steps}`}
        className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-wash"
      >
        <div className="h-full rounded-full bg-reward transition-[width] duration-300" style={{ width: `${((step + 1) / steps) * 100}%` }} />
      </div>

      <div className="mt-4 mb-6 flex items-end gap-2">
        <CatArt mood="idle" className="w-24 shrink-0" />
        <div className="mb-6 rounded-2xl rounded-bl-sm bg-surface px-4 py-3 shadow-[0_2px_12px_rgba(61,59,51,.10)]">
          {moveFocus ? (
            <ScreenHeading key={headingId} id={headingId} className={heading}>{question}</ScreenHeading>
          ) : (
            <h1 id={headingId} className={heading}>{question}</h1>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
