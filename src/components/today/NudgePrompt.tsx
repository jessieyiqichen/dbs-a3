"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { updateSettings } from "@/lib/actions";
import { formatShortDate } from "@/lib/dates";
import { addToCalendar, notificationPermission, turnOnNotifications, type Permission } from "@/lib/reminders";

/** Asked in place, only after something useful is done. The details live on the Reminders page. */
interface Props {
  times: string[];
  /** Called before an action, so the card stays open to show what happened. */
  onActed: () => void;
}

export function NudgePrompt({ times, onActed }: Props) {
  const [calendarUntil, setCalendarUntil] = useState<string | null>(null);
  const [permission, setPermission] = useState<Permission>(notificationPermission);
  // Only report the notification result after the person has asked for it.
  const [asked, setAsked] = useState(false);
  const acted = calendarUntil !== null || (asked && permission === "granted");

  return (
    <section aria-labelledby="nudge-prompt" className="mt-8 flex flex-col gap-3 rounded-lg border-2 border-line bg-surface p-4">
      <h2 id="nudge-prompt" className="text-xl font-bold text-ink">Nudge you tomorrow?</h2>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => { onActed(); setCalendarUntil(addToCalendar(times)); }}>Add to calendar</Button>
        {permission !== "unsupported" && !(asked && permission === "granted") && (
          <Button variant="secondary" onClick={async () => { onActed(); setAsked(true); setPermission(await turnOnNotifications()); }}>Turn on notifications</Button>
        )}
        <Button variant="ghost" onClick={() => updateSettings({ nudgePromptDismissed: true })}>{acted ? "Done" : "Not now"}</Button>
      </div>
      <div role="status" className="flex flex-col gap-1 text-sm text-ink">
        {calendarUntil && <p>Open the downloaded file to add it. Covers until {formatShortDate(calendarUntil)}.</p>}
        {asked && permission === "granted" && <p>Notifications on.</p>}
        {asked && permission === "denied" && <p>Blocked in this browser. Try the calendar.</p>}
      </div>
    </section>
  );
}
