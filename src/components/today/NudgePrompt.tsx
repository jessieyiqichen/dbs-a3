"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { updateSettings } from "@/lib/actions";
import { formatShortDate } from "@/lib/dates";
import {
  addToCalendar,
  notificationPermission,
  turnOnNotifications,
  type Permission,
} from "@/lib/reminders";

/** Asked in place, only after something useful is done. The details live on the Reminders page. */
interface Props {
  times: string[];
  /** Called before an action, so the card stays open to show what happened. */
  onActed: () => void;
  /** Today's date: "Not now" hides the card for the rest of it. */
  today: string;
  /** One row on Today (the question, the calendar, Not now), so it fits above the week's bowls on a phone. */
  compact?: boolean;
}

export function NudgePrompt({ times, onActed, today, compact = false }: Props) {
  const [calendarUntil, setCalendarUntil] = useState<string | null>(null);
  const [permission, setPermission] = useState<Permission>(
    notificationPermission,
  );
  // Only report the notification result after the person has asked for it.
  const [asked, setAsked] = useState(false);
  const acted = calendarUntil !== null || (asked && permission === "granted");

  const notNow = () => updateSettings({ nudgePromptSnoozedOn: today });
  const status = (
    <div
      role="status"
      className="flex flex-col gap-1 text-sm text-ink empty:hidden"
    >
      {calendarUntil && (
        <p>
          Open the downloaded file to add it, it covers until{" "}
          {formatShortDate(calendarUntil)}
        </p>
      )}
      {asked && permission === "granted" && <p>Notifications on!</p>}
      {asked && permission === "denied" && (
        <p>Blocked in this browser, try the calendar instead</p>
      )}
    </div>
  );
  if (compact) {
    // The calendar is the one action here: it reminds you even when Nudge is closed; notifications and the times
    // are on the Reminders page
    return (
      <section
        aria-labelledby="nudge-prompt"
        className="flex flex-col gap-2 rounded-2xl bg-surface py-2 pl-4 pr-2 shadow-[0_2px_12px_rgba(61,59,51,.08)]"
      >
        <div className="flex items-center gap-2">
          <h2
            id="nudge-prompt"
            className="flex-1 font-display text-base font-semibold leading-tight text-ink"
          >
            Nudge you tomorrow?
          </h2>
          {!calendarUntil && (
            <Button
              variant="secondary"
              className="whitespace-nowrap"
              onClick={() => {
                onActed();
                setCalendarUntil(addToCalendar(times));
              }}
            >
              Add to calendar
            </Button>
          )}
          <Button variant="ghost" className="whitespace-nowrap px-2" onClick={notNow}>
            {acted ? "Done" : "Not now"}
          </Button>
        </div>
        {status}
      </section>
    );
  }
  return (
    <section
      aria-labelledby="nudge-prompt"
      className="flex flex-col gap-3 rounded-2xl bg-surface p-5 shadow-[0_2px_12px_rgba(61,59,51,.08)]"
    >
      <h2
        id="nudge-prompt"
        className="font-display text-xl font-semibold text-ink"
      >
        Nudge you tomorrow?
      </h2>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            onActed();
            setCalendarUntil(addToCalendar(times));
          }}
        >
          Add to calendar
        </Button>
        {permission !== "unsupported" &&
          !(asked && permission === "granted") && (
            <Button
              variant="secondary"
              onClick={async () => {
                onActed();
                setAsked(true);
                setPermission(await turnOnNotifications());
              }}
            >
              Turn on notifications
            </Button>
          )}
        <Button variant="ghost" onClick={notNow}>
          {acted ? "Done" : "Not now"}
        </Button>
      </div>
      {status}
    </section>
  );
}
