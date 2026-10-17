import type { Metadata } from "next";
import { Suspense } from "react";
import { EditGoalScreen } from "@/components/goals/EditGoalScreen";
import { AppShell } from "@/components/ui/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Edit goal · Nudge" };

type Params = PageProps<"/goals/[id]/edit">["params"];

/** Goals live in the browser, so the id is only read here and the goal is found client-side. */
async function EditGoal({ params }: { params: Params }) {
  const { id } = await params;
  return <EditGoalScreen id={id} />;
}

export default function EditGoalPage({ params }: PageProps<"/goals/[id]/edit">) {
  return (
    <AppShell>
      <PageHeader title="Edit goal" />
      <Suspense fallback={<p className="pt-6 text-muted">Loading your goal…</p>}>
        <EditGoal params={params} />
      </Suspense>
    </AppShell>
  );
}
