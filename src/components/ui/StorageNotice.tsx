"use client";

import { downloadText } from "@/lib/download";
import { resetData, type StoreState } from "@/lib/store";
import { Button } from "./Button";

const downloadRaw = (raw: string) => downloadText(raw, "nudge-unreadable-data.json", "application/json");

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
