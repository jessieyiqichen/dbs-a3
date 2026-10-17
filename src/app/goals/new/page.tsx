import type { Metadata } from "next";
import { NewGoalScreen } from "@/components/goals/NewGoalScreen";
import { AppShell } from "@/components/ui/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Add a goal · Nudge" };

export default function NewGoalPage() {
  return (
    <AppShell>
      <PageHeader title="Add a goal" intro="Something that matters but you keep putting off. I'll turn it into a number for each day." />
      <NewGoalScreen />
    </AppShell>
  );
}
