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
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="-ml-2 inline-flex size-11 items-center justify-center rounded-full font-display text-2xl text-muted hover:bg-wash focus-visible:outline-3 focus-visible:outline-focus"
          >
            ←
          </button>
        ) : (
          <span aria-hidden="true" className="-ml-2 size-11" />
        )}
        <div
          role="progressbar"
          aria-label="Setup"
          aria-valuemin={1}
          aria-valuemax={steps}
          aria-valuenow={step + 1}
          aria-valuetext={`Step ${step + 1} of ${steps}`}
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-wash"
        >
          <div className="h-full rounded-full bg-lip transition-[width] duration-300" style={{ width: `${((step + 1) / steps) * 100}%` }} />
        </div>
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
