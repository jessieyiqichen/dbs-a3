"use client";

import { useState } from "react";
import { GoalSetup, BLANK_DRAFT } from "@/components/goals/GoalSetup";
import { Button } from "@/components/ui/Button";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import { addGoal } from "@/lib/actions";
import { toISODate } from "@/lib/dates";
import { startGoal, hostOf } from "@/lib/start";
import { draftFromStarter, STARTERS, type Starter } from "@/lib/starters";
import type { GoalValues } from "@/lib/validate";

type Choice = Starter | "custom" | null;

function begin(values: GoalValues) {
  startGoal(addGoal(values, toISODate(new Date())));
}

function PickScreen({ onPick }: { onPick: (choice: Starter | "custom") => void }) {
  return (
    <section aria-labelledby="first-visit-title" className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col gap-2">
        <p className="text-lg text-muted">Recruiting season is a lot.</p>
        <h1 id="first-visit-title" className="text-4xl font-bold leading-tight tracking-tight text-ink">
          What have you been putting off?
        </h1>
        <p className="text-lg text-muted">Pick one. You&apos;ll set the number next.</p>
      </div>
      <ul className="flex flex-col gap-3">
        {STARTERS.map((starter) => (
          <li key={starter.key}>
            <Button variant="secondary" size="lg" className="w-full justify-start" onClick={() => onPick(starter)}>
              {starter.label}
            </Button>
          </li>
        ))}
        <li>
          <Button variant="secondary" size="lg" className="w-full justify-start" onClick={() => onPick("custom")}>
            Something else…
          </Button>
        </li>
      </ul>
      <p className="text-sm text-muted">Saved on this device. No sign-up.</p>
    </section>
  );
}

export function FirstVisit() {
  const [choice, setChoice] = useState<Choice>(null);
  if (choice === null) return <PickScreen onPick={setChoice} />;

  const starter = choice === "custom" ? null : choice;
  const host = hostOf(starter?.link ?? null);
  return (
    <section aria-labelledby="setup-title" className="flex flex-col gap-6 pt-6">
      <ScreenHeading id="setup-title" className="text-3xl font-bold tracking-tight text-ink">
        {starter ? starter.label : "Your own goal"}
      </ScreenHeading>
      <GoalSetup
        key={starter?.key ?? "custom"}
        initial={starter ? draftFromStarter(starter, toISODate(new Date())) : BLANK_DRAFT}
        fields={starter ? "numbers" : "full"}
        submitLabel="Start my first one →"
        submitHint={host ? `Opens ${host}. Come back and tell me how many.` : "Go do one, then come back and tell me how many."}
        onSubmit={begin}
        footer={
          <Button variant="ghost" className="self-start" onClick={() => setChoice(null)}>
            ← Pick something else
          </Button>
        }
      />
    </section>
  );
}
