"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { parseCount } from "@/lib/validate";

interface LogSeveralProps {
  unit: string;
  onAdd: (amount: number) => void;
}

export function LogSeveral({ unit, onAdd }: LogSeveralProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = parseCount(text);
    if (!parsed.ok) {
      setError(parsed.error); // keep what they typed
      inputRef.current?.focus();
      return;
    }
    onAdd(parsed.value);
    setText("");
    setError(undefined);
    setOpen(false);
  }

  if (!open) {
    return (
      <Button variant="ghost" aria-expanded={false} onClick={() => setOpen(true)}>
        Log several at once
      </Button>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3 rounded-lg border-2 border-line p-4">
      <Field id={`${id}-count`} label={`How many ${unit} did you just do?`} error={error}>
        {(control) => (
          <TextInput
            {...control}
            ref={inputRef}
            autoFocus
            inputMode="numeric"
            autoComplete="off"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="max-w-40"
          />
        )}
      </Field>
      <div className="flex gap-3">
        <Button type="submit">Add</Button>
        <Button variant="ghost" onClick={() => { setOpen(false); setError(undefined); }}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
