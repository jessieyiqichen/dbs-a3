"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatShortDate } from "@/lib/dates";
import { CALENDAR_DAYS } from "@/lib/ics";
import { addToCalendar } from "@/lib/reminders";

export function CalendarCard({ times }: { times: string[] }) {
  const [until, setUntil] = useState<string | null>(null);

  return (
    <section aria-labelledby="calendar-title" className="flex flex-col gap-3 border-t-2 border-wash-strong pt-6">
      <h2 id="calendar-title" className="font-display text-xl font-semibold text-ink">Add to my calendar</h2>
      <p className="font-bold text-muted">Works even when Nudge is closed: your calendar rings at {times.join(", ")} and brings you back here~</p>
      <p className="text-sm font-bold text-muted">A calendar can&apos;t tell whether you&apos;ve done it, so if you&apos;re done for the day, just ignore it~</p>
      <Button onClick={() => setUntil(addToCalendar(times))} className="self-start">Download calendar file</Button>
      {until && (
        <p role="status" className="text-sm font-bold text-ink">
          Open nudge-reminders.ics to add it, it covers {CALENDAR_DAYS} days until {formatShortDate(until)}, then grab a new one~
        </p>
      )}
    </section>
  );
}
