"use client";

import { addDays, daysBetween, formatShortDate } from "@/lib/dates";
import { amountTiers, dateOptions, perDayFor } from "@/lib/onboarding";
import { STARTERS } from "@/lib/starters";
import type { GoalType } from "@/lib/types";
import { linkError, MAX_TARGET } from "@/lib/validate";
import { Choices, TreatsPerDay } from "./Choices";
import { OwnAnswer } from "./OwnAnswer";

/** The answers to Titi's questions, then the props each step shares. */
export interface Answers {
  starterKey: string | null; // null: something of your own
  label: string;
  verb: string;
  unit: string;
  type: GoalType;
  deadline: string;
  amount: number;
  link: string;
}

interface StepProps {
  answers: Answers;
  today: string;
  /** "Type my own" is showing instead of the choices. */
  typing: boolean;
  onType: () => void;
  onAnswer: (next: Partial<Answers>) => void;
}

function checkNumber(text: string): string | undefined {
  if (!/^\d+$/.test(text) || Number(text) < 1) return "Enter a whole number, like 30";
  if (Number(text) > MAX_TARGET) return "Enter a number up to 100,000";
}

function checkDate(today: string) {
  return (v: string) => (!/^\d{4}-\d{2}-\d{2}$/.test(v) ? "Pick the date you want to finish by" : v <= today ? "Pick a date after today" : undefined);
}

export function PickStep({ onPick }: { onPick: (starterKey: string | null) => void }) {
  return (
    <>
      {/* First-run check (2026-10-18): a newcomer could not tell what Nudge was for from the question alone */}
      <p className="mb-4 text-sm font-bold text-muted">Pick one, and Nudge turns it into one small number a day, with Titi cheering you on~</p>
      <Choices
        label="Things to start"
        choices={[...STARTERS.map((s) => ({ key: s.key, label: s.label })), { key: "own", label: "Something else" }]}
        onPick={(k) => onPick(k === "own" ? null : k)}
      />
      <p className="mt-6 text-sm text-muted">Saved on this device, no sign-up needed~</p>
    </>
  );
}

export function WhatStep({ answers, onAnswer }: StepProps) {
  return (
    <OwnAnswer
      id="own-what"
      label="What will you do?"
      hint='Like "Send cold emails" or "Practice LeetCode problems"'
      kind="text"
      initial={answers.label}
      check={(v) => (!v ? 'Enter what you\'ll do, like "Send cold emails"' : v.length > 60 ? "Keep it under 60 characters" : undefined)}
      onDone={(v) => onAnswer({ label: v })}
    />
  );
}

export function OftenStep({ onAnswer }: StepProps) {
  return (
    <Choices
      label="How often"
      choices={[
        { key: "daily", label: "Every day", detail: "The same number each day" },
        { key: "by-date", label: "A total by a date", detail: "Like 50 by the end of the month" },
      ]}
      onPick={(k) => onAnswer({ type: k as GoalType })}
    />
  );
}

export function DateStep({ today, typing, onType, onAnswer }: StepProps) {
  if (typing) {
    return <OwnAnswer id="own-date" label="Finish by" kind="date" min={addDays(today, 1)} check={checkDate(today)} onDone={(v) => onAnswer({ deadline: v })} />;
  }
  const options = dateOptions(today).map((o) => ({ key: o.date, label: o.label, detail: `By ${formatShortDate(o.date)}` }));
  return <Choices label="Finish by" choices={[...options, { key: "pick", label: "Pick a date" }]} onPick={(k) => (k === "pick" ? onType() : onAnswer({ deadline: k }))} />;
}

export function AmountStep({ answers, today, typing, onType, onAnswer, question, unit }: StepProps & { question: string; unit: string }) {
  const { type, deadline, starterKey } = answers;
  const perDay = (n: number) => perDayFor(type, n, deadline, today);
  if (typing) {
    return (
      <OwnAnswer
        id="own-amount"
        label={type === "daily" ? "How many each day?" : "How many in total?"}
        kind="number"
        check={checkNumber}
        preview={(v) => (checkNumber(v) ? null : `That's ${perDay(Number(v))} fish treats a day for Titi!`)}
        onDone={(v) => onAnswer({ amount: Number(v) })}
      />
    );
  }
  const days = type === "by-date" ? daysBetween(today, deadline) + 1 : 1;
  const tiers = amountTiers(type, starterKey, days).map((t) => ({
    key: String(t.amount),
    label: t.label,
    detail: type === "daily" ? undefined : `${t.amount} ${unit}`,
    aside: <TreatsPerDay n={perDay(t.amount)} />,
  }));
  return <Choices label={question} choices={[...tiers, { key: "own", label: "Type my own number" }]} onPick={(k) => (k === "own" ? onType() : onAnswer({ amount: Number(k) }))} />;
}

/** A goal of your own: the page Start should open, if there is one. */
export function LinkStep({ answers, onAnswer }: StepProps) {
  return (
    <OwnAnswer
      id="own-link"
      label="Page to open when you start"
      hint="Like https://www.linkedin.com/jobs/"
      kind="url"
      initial={answers.link}
      check={(v) => linkError(v)}
      onDone={(v) => onAnswer({ link: v })}
      onSkip={() => onAnswer({ link: "" })}
    />
  );
}
