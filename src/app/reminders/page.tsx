import type { Metadata } from "next";
import { RemindersScreen } from "@/components/reminders/RemindersScreen";
import { AppShell } from "@/components/ui/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Reminders · Nudge" };

export default function RemindersPage() {
  return (
    <AppShell>
      <PageHeader
        title="Reminders"
        back="/goals"
        backLabel="← Back to goals"
        intro="Two ways to find you: the calendar works when Nudge is closed, notifications know whether you've started"
      />
      <RemindersScreen />
    </AppShell>
  );
}
