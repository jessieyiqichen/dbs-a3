"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { addDays, toISODate } from "@/lib/dates";
import { goalSentence } from "@/lib/phrases";
import type { Goal, GoalType } from "@/lib/types";
import { dailyPreview, validateGoal, type GoalDraft, type GoalField, type GoalValidation, type GoalValues } from "@/lib/validate";

const FIELD_ORDER: GoalField[] = ["verb", "unit", "target", "deadline", "link"];

const TYPE_OPTIONS: { value: GoalType; label: string }[] = [
  { value: "daily", label: "Every day" },
  { value: "by-date", label: "A total by a date" },
];

export const BLANK_DRAFT: GoalDraft = { verb: "", unit: "", type: "daily", target: "", deadline: "", link: "" };

export function draftFromGoal(goal: Goal): GoalDraft {
  return {
    verb: goal.verb,
    unit: goal.unit,
    type: goal.type,
    target: String(goal.target),
    deadline: goal.deadline ?? "",
    link: goal.link ?? "",
  };
}

interface GoalSetupProps {
  initial: GoalDraft;
  /** "numbers": only how many and by when (a starter). "full": every field. */
  fields: "numbers" | "full";
  submitLabel: string;
  submitHint?: string;
  onSubmit: (values: GoalValues) => void;
  footer?: ReactNode;
}

function validNumber(text: string): number | null {
  return /^\d+$/.test(text.trim()) && Number(text) > 0 ? Number(text) : null;
}

/** The goal as a live sentence on top, with one column of labelled fields below. */
export function GoalSetup({ initial, fields, submitLabel, submitHint, onSubmit, footer }: GoalSetupProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<GoalDraft>(initial);
  const [errors, setErrors] = useState<GoalValidation["errors"]>({});
  const today = toISODate(new Date());
  // Typing into a field that shows an error re-checks just that field, so the error leaves as soon as it is fixed.
  const set = (field: GoalField) => (value: string) =>
    setDraft((d) => {
      const next = { ...d, [field]: value };
      if (errors[field]) setErrors((e) => ({ ...e, [field]: validateGoal(next, today).errors[field] }));
      return next;
    });
  const preview = draft.type === "by-date" ? dailyPreview(draft.target, draft.deadline, draft.unit, today) : null;
  const sentence = goalSentence({
    verb: draft.verb,
    unit: draft.unit.trim().toLowerCase() || "times",
    type: draft.type,
    target: validNumber(draft.target),
    deadline: draft.deadline || null,
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    const result = validateGoal(draft, today);
    setErrors(result.errors); // the draft stays exactly as typed
    if (!result.value) {
      const first = FIELD_ORDER.find((field) => result.errors[field]);
      formRef.current?.querySelector<HTMLElement>(`#goal-${first}`)?.focus();
      return;
    }
    onSubmit(result.value);
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-6">
      <div aria-live="polite" className="flex flex-col gap-2">
        <p className="font-display text-xl font-semibold leading-snug text-muted">{sentence}</p>
        {preview && <p className={`text-lg font-bold ${preview.perDay > 50 ? "text-ink" : "text-muted"}`}>{preview.message}</p>}
      </div>

      {fields === "full" && (
        <>
          <Field id="goal-verb" label="What will you do?" hint='One or two words, like "Send" or "Practice"' error={errors.verb}>
            {(control) => <TextInput {...control} value={draft.verb} onChange={(e) => set("verb")(e.target.value)} className="max-w-64" autoComplete="off" />}
          </Field>
          <Field id="goal-unit" label="What are you counting? (optional)" hint='Like "applications" or "interview questions", or blank to count times' error={errors.unit}>
            {(control) => <TextInput {...control} value={draft.unit} onChange={(e) => set("unit")(e.target.value)} className="max-w-80" autoComplete="off" />}
          </Field>
          <RadioGroup name="goal-type" legend="How often?" options={TYPE_OPTIONS} value={draft.type} onChange={(v) => set("type")(v)} />
        </>
      )}

      <Field id="goal-target" label={draft.type === "by-date" ? "How many in total?" : "How many each day?"} error={errors.target}>
        {(control) => (
          <TextInput {...control} inputMode="numeric" value={draft.target} onChange={(e) => set("target")(e.target.value)} className="max-w-32" autoComplete="off" />
        )}
      </Field>

      {draft.type === "by-date" && (
        <Field id="goal-deadline" label="By when?" error={errors.deadline}>
          {(control) => (
            <TextInput {...control} type="date" min={addDays(today, 1)} value={draft.deadline} onChange={(e) => set("deadline")(e.target.value)} className="max-w-52" />
          )}
        </Field>
      )}

      {fields === "full" && (
        <Field id="goal-link" label="Page to open when you start (optional)" hint="Like https://www.linkedin.com/mynetwork/" error={errors.link}>
          {(control) => <TextInput {...control} type="url" inputMode="url" value={draft.link} onChange={(e) => set("link")(e.target.value)} autoComplete="url" />}
        </Field>
      )}

      <div className="flex flex-col gap-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto sm:self-start">{submitLabel}</Button>
        {submitHint && <p className="text-sm text-muted">{submitHint}</p>}
      </div>
      {footer}
    </form>
  );
}
