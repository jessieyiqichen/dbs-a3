"use client";

import { resetData, type StoreState } from "@/lib/store";
import { Button } from "./Button";

function downloadRaw(raw: string) {
  const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "nudge-unreadable-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

export function StorageNotice({ state }: { state: StoreState }) {
  if (state.kind === "corrupt") {
    return (
      <section role="alert" className="mt-6 flex flex-col gap-4 rounded-lg border-2 border-danger p-4">
        <h1 className="text-xl font-bold text-ink">Your saved goals couldn&apos;t be read</h1>
        <p className="text-ink">Download a copy to keep it, then start fresh.</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => downloadRaw(state.raw)}>Download a copy</Button>
          <Button variant="danger" onClick={() => { if (window.confirm("Delete the unreadable data and start fresh?")) resetData(); }}>
            Start fresh
          </Button>
        </div>
      </section>
    );
  }
  return (
    <p role="status" className="mt-2 rounded-lg bg-wash p-3 text-sm text-ink">
      This browser isn&apos;t saving (private mode or blocked storage). Your goals will be gone when you close the tab.
    </p>
  );
}
