"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { updateSettings } from "@/lib/actions";
import { addDays, formatShortDate, toISODate } from "@/lib/dates";
import { downloadText } from "@/lib/download";
import { buildIcs, CALENDAR_DAYS } from "@/lib/ics";

export function CalendarCard({ times }: { times: string[] }) {
  const [until, setUntil] = useState<string | null>(null);

  function download() {
    const start = toISODate(new Date());
    const ics = buildIcs({ times, startDate: start, days: CALENDAR_DAYS, appUrl: window.location.origin, stamp: new Date() });
    downloadText(ics, "nudge-reminders.ics", "text/calendar");
    updateSettings({ nudgesSetUp: true });
    setUntil(addDays(start, CALENDAR_DAYS - 1));
  }

  return (
    <section aria-labelledby="calendar-title" className="flex flex-col gap-3 rounded-lg border-2 border-line bg-surface p-4">
      <h2 id="calendar-title" className="text-xl font-bold text-ink">Add to my calendar</h2>
      <p className="text-ink">
        Works even when Nudge is closed. Your calendar reminds you at {times.join(", ")}, each time with a different line,
        and tapping it brings you back here.
      </p>
      <p className="text-sm text-muted">
        A calendar can&apos;t tell whether you&apos;ve already done it, so it rings anyway. Done for the day? Just ignore it.
      </p>
      <Button onClick={download} className="self-start">Download calendar file</Button>
      {until && (
        <p role="status" className="text-sm text-ink">
          Downloaded. Open nudge-reminders.ics to add it to your calendar. It covers the next {CALENDAR_DAYS} days, until{" "}
          {formatShortDate(until)}. Download it again then, or after you change your times.
        </p>
      )}
    </section>
  );
}
