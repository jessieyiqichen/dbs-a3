"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { addGoal, updateGoal } from "@/lib/actions";
import { addDays, toISODate } from "@/lib/dates";
import { setFocusGoal } from "@/lib/store";
import type { Goal, GoalType } from "@/lib/types";
import { dailyPreview, validateGoal, type GoalDraft, type GoalField, type GoalValidation } from "@/lib/validate";

const FIELD_ORDER: GoalField[] = ["title", "target", "deadline", "link"];

const TYPE_OPTIONS: { value: GoalType; label: string }[] = [
  { value: "by-date", label: "A total by a date" },
  { value: "daily", label: "A number every day" },
];

export function draftFrom(goal?: Goal): GoalDraft {
  if (!goal) return { title: "", type: "by-date", target: "", unit: "", deadline: "", link: "" };
  return {
    title: goal.title,
    type: goal.type,
    target: String(goal.target),
    unit: goal.unit,
    deadline: goal.deadline ?? "",
    link: goal.link ?? "",
  };
}

export function GoalForm({ goal }: { goal?: Goal }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<GoalDraft>(() => draftFrom(goal));
  const [errors, setErrors] = useState<GoalValidation["errors"]>({});
  const today = toISODate(new Date());
  const set = (field: GoalField) => (value: string) => setDraft((d) => ({ ...d, [field]: value }));
  const preview = draft.type === "by-date" ? dailyPreview(draft.target, draft.deadline, draft.unit, today) : null;

  function submit(event: FormEvent) {
    event.preventDefault();
    const result = validateGoal(draft, today);
    setErrors(result.errors); // the draft stays exactly as typed
    if (!result.value) {
      const first = FIELD_ORDER.find((field) => result.errors[field]);
      formRef.current?.querySelector<HTMLElement>(`#goal-${first}`)?.focus();
      return;
    }
    const id = goal ? goal.id : addGoal(result.value, today).id;
    if (goal) updateGoal(goal.id, result.value);
    setFocusGoal(id);
    router.push("/");
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="mt-8 flex flex-col gap-6">
      <Field id="goal-title" label="What do you want to push yourself to do?" hint='For example "Send LinkedIn connection requests".' error={errors.title}>
        {(control) => (
          <TextInput {...control} value={draft.title} onChange={(e) => set("title")(e.target.value)} autoComplete="off" />
        )}
      </Field>

      <RadioGroup name="goal-type" legend="How do you want to count it?" options={TYPE_OPTIONS} value={draft.type} onChange={(v) => set("type")(v)} />

      <Field id="goal-target" label={draft.type === "by-date" ? "How many in total?" : "How many each day?"} error={errors.target}>
        {(control) => (
          <TextInput {...control} inputMode="numeric" value={draft.target} onChange={(e) => set("target")(e.target.value)} className="max-w-40" autoComplete="off" />
        )}
      </Field>

      {draft.type === "by-date" && (
        <Field id="goal-deadline" label="By when?" error={errors.deadline}>
          {(control) => (
            <TextInput {...control} type="date" min={addDays(today, 1)} value={draft.deadline} onChange={(e) => set("deadline")(e.target.value)} className="max-w-52" />
          )}
        </Field>
      )}

      {preview && (
        <p role="status" className={`rounded-lg p-3 ${preview.perDay > 50 ? "bg-wash font-semibold text-ink" : "bg-wash text-ink"}`}>
          {preview.message}
        </p>
      )}

      <Field id="goal-unit" label="What are you counting? (optional)" hint="For example connections or applications. Leave it blank to count times.">
        {(control) => (
          <TextInput {...control} value={draft.unit} onChange={(e) => set("unit")(e.target.value)} className="max-w-64" autoComplete="off" />
        )}
      </Field>

      <Field id="goal-link" label="Where do you do it? (optional)" hint="Paste the page you use, like https://www.linkedin.com/mynetwork/. I'll add a button that opens it." error={errors.link}>
        {(control) => (
          <TextInput {...control} type="url" inputMode="url" value={draft.link} onChange={(e) => set("link")(e.target.value)} autoComplete="url" />
        )}
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg">{goal ? "Save changes" : "Start this goal"}</Button>
        <ButtonLink href="/" variant="ghost">Cancel</ButtonLink>
      </div>
    </form>
  );
}
