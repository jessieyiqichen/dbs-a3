"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { updateSettings } from "@/lib/actions";
import { formatShortDate } from "@/lib/dates";
import { addToCalendar, notificationPermission, turnOnNotifications, type Permission } from "@/lib/reminders";

/** Asked in place, only after something useful is done: calendar works when closed, notifications know if you started. */
interface Props {
  firstDay: boolean;
  times: string[];
  /** Called before an action, so the card stays open to show what happened. */
  onActed: () => void;
}

export function NudgePrompt({ firstDay, times, onActed }: Props) {
  const [calendarUntil, setCalendarUntil] = useState<string | null>(null);
  const [permission, setPermission] = useState<Permission>(notificationPermission);
  // Only report the notification result after the person has asked for it.
  const [asked, setAsked] = useState(false);
  const acted = calendarUntil !== null || (asked && permission === "granted");

  return (
    <section aria-labelledby="nudge-prompt" className="mt-8 flex flex-col gap-3 rounded-lg border-2 border-line bg-surface p-4">
      {firstDay && <p className="font-semibold text-ink">Nice, that&apos;s day one.</p>}
      <h2 id="nudge-prompt" className="text-xl font-bold text-ink">Want me to nudge you tomorrow?</h2>
      <p className="text-muted">
        At {times.join(", ")}. Your calendar reminds you even when Nudge is closed. Notifications only come if you haven&apos;t started.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => { onActed(); setCalendarUntil(addToCalendar(times)); }}>Add to calendar</Button>
        {permission !== "unsupported" && !(asked && permission === "granted") && (
          <Button variant="secondary" onClick={async () => { onActed(); setAsked(true); setPermission(await turnOnNotifications()); }}>Turn on notifications</Button>
        )}
        <Button variant="ghost" onClick={() => updateSettings({ nudgePromptDismissed: true })}>{acted ? "Done" : "Not now"}</Button>
      </div>
      <div role="status" className="flex flex-col gap-1 text-sm text-ink">
        {calendarUntil && <p>Downloaded. Open nudge-reminders.ics to add it to your calendar (covers until {formatShortDate(calendarUntil)}).</p>}
        {asked && permission === "granted" && <p>Notifications are on.</p>}
        {asked && permission === "denied" && <p>Notifications are blocked for this site. You can allow them in your browser&apos;s site settings, or use the calendar.</p>}
      </div>
    </section>
  );
}
