"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { updateSettings } from "@/lib/actions";

export function NudgePrompt({ firstDay }: { firstDay: boolean }) {
  return (
    <section aria-labelledby="nudge-prompt" className="mt-8 flex flex-col gap-3 rounded-lg border-2 border-ink bg-surface p-4">
      {firstDay && <p className="font-semibold text-ink">Nice, that&apos;s day one.</p>}
      <h2 id="nudge-prompt" className="text-xl font-bold text-ink">
        Want me to nudge you tomorrow?
      </h2>
      <p className="text-muted">I&apos;ll remind you a few times a day, more often if you haven&apos;t started.</p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/reminders">Set up nudges</ButtonLink>
        <Button variant="ghost" onClick={() => updateSettings({ nudgePromptDismissed: true })}>
          Not now
        </Button>
      </div>
    </section>
  );
}
