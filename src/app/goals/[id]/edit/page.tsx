import type { Metadata } from "next";
import { Suspense } from "react";
import { EditGoalScreen } from "@/components/goals/EditGoalScreen";
import { AppShell } from "@/components/ui/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Edit goal · Nudge" };

/** Goals live in the browser, so the id is only read here and the goal is found client-side. */
export default async function EditGoalPage({ params }: PageProps<"/goals/[id]/edit">) {
  const { id } = await params;
  return (
    <AppShell>
      {/* Back goes to the goal's progress page, where Edit was tapped (first-run check, 2026-10-18) */}
      <PageHeader title="Edit goal" back={`/goals/${id}`} backLabel="← Back to progress" />
      <Suspense fallback={<p className="pt-6 text-muted">Loading your goal…</p>}>
        <EditGoalScreen id={id} />
      </Suspense>
    </AppShell>
  );
}
