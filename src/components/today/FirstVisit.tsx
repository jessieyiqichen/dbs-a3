"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { toISODate } from "@/lib/dates";
import { goalFromStarter, STARTERS, type Starter } from "@/lib/starters";
import { updateData } from "@/lib/store";

function startWith(starter: Starter) {
  const now = new Date();
  const goal = goalFromStarter(starter, toISODate(now), crypto.randomUUID(), now.toISOString());
  updateData((data) => ({ ...data, goals: [...data.goals, goal] }));
}

export function FirstVisit() {
  return (
    <section aria-labelledby="first-visit-title" className="flex flex-col gap-8 pt-6">
      <div className="flex flex-col gap-3">
        <h1 id="first-visit-title" className="text-4xl font-bold leading-tight tracking-tight text-ink">
          What have you been putting off?
        </h1>
        <p className="text-lg text-muted">
          Pick one. I&apos;ll turn it into today&apos;s number and keep nudging until you start.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {STARTERS.map((starter) => (
          <li key={starter.key}>
            <Button variant="secondary" size="lg" className="w-full justify-start text-left" onClick={() => startWith(starter)}>
              {starter.label}
              {starter.daysToDeadline !== null && <span className="font-normal text-muted">in {starter.daysToDeadline} days</span>}
            </Button>
          </li>
        ))}
        <li>
          <ButtonLink href="/goals/new" variant="ghost" size="lg" className="w-full justify-start">
            + Write my own
          </ButtonLink>
        </li>
      </ul>

      <p className="text-sm text-muted">Saved on this device. No sign-up.</p>
    </section>
  );
}
