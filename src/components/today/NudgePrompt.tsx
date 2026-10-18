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
    <section aria-labelledby="nudge-prompt" className="flex flex-col gap-3 rounded-2xl bg-surface p-5 shadow-[0_2px_12px_rgba(61,59,51,.08)]">
      <h2 id="nudge-prompt" className="font-display text-xl font-semibold text-ink">Nudge you tomorrow?</h2>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => { onActed(); setCalendarUntil(addToCalendar(times)); }}>Add to calendar</Button>
        {permission !== "unsupported" && !(asked && permission === "granted") && (
          <Button variant="secondary" onClick={async () => { onActed(); setAsked(true); setPermission(await turnOnNotifications()); }}>Turn on notifications</Button>
        )}
        <Button variant="ghost" onClick={() => updateSettings({ nudgePromptDismissed: true })}>{acted ? "Done" : "Not now"}</Button>
      </div>
      <div role="status" className="flex flex-col gap-1 text-sm text-ink">
        {calendarUntil && <p>Open the downloaded file to add it, it covers until {formatShortDate(calendarUntil)}</p>}
        {asked && permission === "granted" && <p>Notifications on!</p>}
        {asked && permission === "denied" && <p>Blocked in this browser, try the calendar instead</p>}
      </div>
    </section>
  );
}
