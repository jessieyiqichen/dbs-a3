import type { Metadata } from "next";
import { GoalsScreen } from "@/components/goals/GoalsScreen";
import { AppShell } from "@/components/ui/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Goals · Nudge" };

export default function GoalsPage() {
  return (
    <AppShell>
      <PageHeader title="Your goals" intro="Check progress, take a break, or tidy up." />
      <GoalsScreen />
    </AppShell>
  );
}
