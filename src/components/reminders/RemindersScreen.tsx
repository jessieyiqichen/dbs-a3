"use client";

import { useState } from "react";
import { StorageNotice } from "@/components/ui/StorageNotice";
import { useStore } from "@/lib/store";
import { CalendarCard } from "./CalendarCard";
import { NotificationsCard } from "./NotificationsCard";
import { TimesForm } from "./TimesForm";

export function RemindersScreen() {
  const state = useStore();
  const [savedNote, setSavedNote] = useState<string | null>(null);

  if (state === null) return <p className="pt-6 text-muted">Loading your reminders…</p>;
  if (state.kind === "corrupt") return <StorageNotice state={state} />;
  const { settings } = state.data;

  return (
    <div className="mt-8 flex flex-col gap-8">
      {!state.persistent && <StorageNotice state={state} />}
      <section aria-labelledby="times-title" className="flex flex-col gap-4">
        <h2 id="times-title" className="font-display text-xl font-semibold text-ink">When should I nudge you?</h2>
        <TimesForm
          saved={settings.reminderTimes}
          onSaved={(times) => setSavedNote(`Saved ${times.join(", ")}! Using the calendar file? Download it again for the new times`)}
        />
        {savedNote && <p role="status" className="text-sm font-bold text-ink">{savedNote}</p>}
      </section>
      <CalendarCard times={settings.reminderTimes} />
      <NotificationsCard on={settings.notificationsOn} times={settings.reminderTimes} />
    </div>
  );
}
