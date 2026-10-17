"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { restoreData } from "@/lib/actions";
import { toISODate } from "@/lib/dates";
import { downloadText } from "@/lib/download";
import { parseData } from "@/lib/storage";
import type { AppData } from "@/lib/types";

const BAD_FILE = "This file isn't a Nudge backup. Choose the .json file you exported.";

export function BackupSection({ data }: { data: AppData }) {
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState<AppData | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function choose(event: ChangeEvent<HTMLInputElement>) {
    setDone(null);
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = parseData(await file.text());
      setError(parsed ? undefined : BAD_FILE);
      setPending(parsed);
    } catch (readError) {
      console.error("Nudge: could not read backup file", readError);
      setError("That file couldn't be opened. Try choosing it again.");
      setPending(null);
    }
  }

  function confirmRestore() {
    if (!pending) return;
    restoreData(pending);
    setDone(`Restored ${pending.goals.length === 1 ? "1 goal" : `${pending.goals.length} goals`}.`);
    setPending(null);
  }

  return (
    <section aria-labelledby="backup-title" className="mt-12 flex flex-col gap-4">
      <h2 id="backup-title" className="text-xl font-bold text-ink">Backup</h2>
      <p className="text-ink">
        Your goals live only in this browser. Clearing your browsing data deletes them, so keep a copy now and then.
      </p>
      <Button
        variant="secondary"
        className="self-start"
        onClick={() => downloadText(JSON.stringify(data, null, 2), `nudge-backup-${toISODate(new Date())}.json`, "application/json")}
      >
        Download backup
      </Button>

      <Field id="restore-file" label="Restore from a backup file" hint="Choose a .json file you downloaded from Nudge." error={error}>
        {(control) => (
          <input
            {...control}
            type="file"
            accept="application/json,.json"
            onChange={choose}
            className="text-ink file:mr-3 file:min-h-11 file:rounded-lg file:border-2 file:border-ink file:bg-surface file:px-4 file:font-semibold file:text-ink focus-visible:outline-3 focus-visible:outline-focus"
          />
        )}
      </Field>

      {pending && (
        <div role="alert" className="flex flex-col gap-2 rounded-lg border-2 border-danger p-3">
          <p className="font-semibold text-ink">
            This replaces the goals on this device with the {pending.goals.length === 1 ? "1 goal" : `${pending.goals.length} goals`} in the file.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="danger" onClick={confirmRestore}>Replace with backup</Button>
            <Button variant="ghost" onClick={() => setPending(null)}>Cancel</Button>
          </div>
        </div>
      )}
      {done && <p role="status" className="font-semibold text-ink">{done}</p>}
    </section>
  );
}
