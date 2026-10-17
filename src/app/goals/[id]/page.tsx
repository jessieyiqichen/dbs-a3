import type { Metadata } from "next";
import { Suspense } from "react";
import { ProgressScreen } from "@/components/progress/ProgressScreen";
import { AppShell } from "@/components/ui/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Progress · Nudge" };

type Params = PageProps<"/goals/[id]">["params"];

async function Progress({ params }: { params: Params }) {
  const { id } = await params;
  return <ProgressScreen id={id} />;
}

export default function ProgressPage({ params }: PageProps<"/goals/[id]">) {
  return (
    <AppShell>
      <PageHeader title="Progress" back="/goals" backLabel="← Back to goals" />
      <Suspense fallback={<p className="pt-6 text-muted">Loading your progress…</p>}>
        <Progress params={params} />
      </Suspense>
    </AppShell>
  );
}
