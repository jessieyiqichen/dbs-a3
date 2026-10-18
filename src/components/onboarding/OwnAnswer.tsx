"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";

interface Props {
  id: string;
  label: string;
  hint?: string;
  kind: "text" | "number" | "date" | "url";
  min?: string;
  initial?: string;
  /** Returns an error that says what to do next, or nothing when the answer is fine. */
  check: (value: string) => string | undefined;
  /** A live line under the field, e.g. "That's about 5 a day!" */
  preview?: (value: string) => string | null;
  onDone: (value: string) => void;
  /** For an optional question: a quiet way past it. */
  onSkip?: () => void;
}

/** "Type my own": one labelled field and Continue. On an error the answer stays as typed and focus returns to it. */
export function OwnAnswer({ id, label, hint, kind, min, initial = "", check, preview, onDone, onSkip }: Props) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<string | undefined>();
  const ref = useRef<HTMLInputElement>(null);
  const line = preview?.(value) ?? null;

  function submit(event: FormEvent) {
    event.preventDefault();
    const problem = check(value.trim());
    setError(problem);
    if (problem) {
      ref.current?.focus();
      return;
    }
    onDone(value.trim());
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Field id={id} label={label} hint={hint} error={error}>
        {(control) => (
          <TextInput
            {...control}
            ref={ref}
            autoFocus
            type={kind === "date" ? "date" : kind === "url" ? "url" : "text"}
            inputMode={kind === "number" ? "numeric" : kind === "url" ? "url" : undefined}
            autoCapitalize={kind === "url" ? "off" : undefined}
            min={min}
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={kind === "text" || kind === "url" ? "" : "max-w-52"}
          />
        )}
      </Field>
      {line && <p aria-live="polite" className="font-bold text-muted">{line}</p>}
      <Button type="submit" size="lg" className="w-full">Continue</Button>
      {onSkip && <Button variant="ghost" className="self-center" onClick={onSkip}>Skip, no page~</Button>}
    </form>
  );
}
