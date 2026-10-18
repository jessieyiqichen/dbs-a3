"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import { quickAmounts } from "@/lib/phrases";
import type { Goal } from "@/lib/types";
import { parseCount } from "@/lib/validate";
import { CatArt } from "./CatArt";
import { Coins } from "./Coins";

interface Props {
  goal: Goal;
  /** Today's number and how many were already logged before this round. */
  total: number;
  done: number;
  onLog: (amount: number) => void;
  onNone: () => void;
}

/** After Start: one tap on the fish you reached logs the round (Undo is in the toast).
 *  More than today's number, or a number too big for fish, goes in the field. */
export function AskHowMany({ goal, total, done, onLog, onNone }: Props) {
  const id = useId();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [typing, setTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const verb = goal.verb ? goal.verb.toLowerCase() : "do";
  const coins = total <= 12;
  const left = Math.max(total - done, 0);

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
    <section aria-labelledby={`${id}-title`} className="flex flex-col pt-2">
      <CatArt mood="idle" className="mb-4 w-40 self-center" />
      <ScreenHeading id={`${id}-title`} className="font-display text-4xl font-bold leading-tight text-ink">
        How many did you {verb}?
      </ScreenHeading>
      <p className="mt-3 text-lg font-bold text-muted">{coins ? "Tap the last one you finished~" : "Pick one, or type it~"}</p>

      <div className="mt-10">
        {coins ? (
          <Coins total={total} done={done} label={`How many did you ${verb}`} onPick={(reached) => onLog(reached - done)} />
        ) : (
          <div role="group" aria-label={`How many did you ${verb}`} className="flex flex-wrap gap-2">
            {quickAmounts(left).map((n) => (
              <Button key={n} variant="secondary" size="lg" className="min-w-16" onClick={() => onLog(n)}>
                {left > 0 && n === left ? `All ${n}` : n}
              </Button>
            ))}
          </div>
        )}
      </div>

      {typing || !coins ? (
        <form onSubmit={submit} noValidate className="mt-8 flex items-end gap-3">
          <Field id={`${id}-other`} label={coins ? `More than ${total}? Type it` : "Another number"} error={error}>
            {(control) => (
              <TextInput {...control} ref={inputRef} autoFocus={typing} inputMode="numeric" autoComplete="off" value={text} onChange={(e) => setText(e.target.value)} className="w-28" />
            )}
          </Field>
          <Button type="submit" variant="secondary" className={error ? "mb-7" : ""}>Add</Button>
        </form>
      ) : (
        <Button variant="ghost" className="mt-8 self-start" onClick={() => setTyping(true)}>
          Did more than {total}?
        </Button>
      )}
      <Button variant="ghost" className="mt-3 self-start" onClick={onNone}>
        None yet
      </Button>
    </section>
  );
}
