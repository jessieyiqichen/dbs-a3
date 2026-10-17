"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import { quickAmounts } from "@/lib/phrases";
import { siteName } from "@/lib/start";
import type { Goal } from "@/lib/types";
import { parseCount } from "@/lib/validate";

interface Props {
  goal: Goal;
  left: number;
  onLog: (amount: number) => void;
  onNone: () => void;
}

/** After Start: one tap logs the whole session. */
export function AskHowMany({ goal, left, onLog, onNone }: Props) {
  const id = useId();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);
  const site = siteName(goal.link);
  const verb = goal.verb ? goal.verb.toLowerCase() : "do";

  function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = parseCount(text);
    if (!parsed.ok) {
      setError(parsed.error); // keep what they typed
      inputRef.current?.focus();
      return;
    }
    onLog(parsed.value);
  }

  return (
    <section aria-labelledby={`${id}-title`} className="flex flex-col gap-5 pt-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">Today · {goal.title}</p>
        <ScreenHeading id={`${id}-title`} className="text-4xl font-bold tracking-tight text-ink">
          {site ? `Back from ${site}?` : "Done with this round?"}
        </ScreenHeading>
      </div>
      <div role="group" aria-labelledby={`${id}-q`} className="flex flex-col gap-3">
        <p id={`${id}-q`} className="text-xl text-ink">How many did you {verb}?</p>
        <div className="flex flex-wrap gap-2">
          {quickAmounts(left).map((n) => (
            <Button key={n} variant="secondary" size="lg" className="min-w-16" onClick={() => onLog(n)}>
              {left > 0 && n === left ? `All ${n}` : n}
            </Button>
          ))}
        </div>
      </div>
      <form onSubmit={submit} noValidate className="flex items-end gap-3">
        <Field id={`${id}-other`} label="Another number" error={error}>
          {(control) => (
            <TextInput {...control} ref={inputRef} inputMode="numeric" autoComplete="off" value={text} onChange={(e) => setText(e.target.value)} className="w-28" />
          )}
        </Field>
        <Button type="submit" variant="secondary" className={error ? "mb-7" : ""}>Add</Button>
      </form>
      <Button variant="ghost" className="self-start" onClick={onNone}>
        I didn&apos;t {verb} any yet
      </Button>
    </section>
  );
}
