"use client";

import { useState } from "react";
import { PlanStep } from "@/components/onboarding/PlanStep";
import { SetupFrame } from "@/components/onboarding/SetupFrame";
import { AmountStep, DateStep, OftenStep, PickStep, WhatStep, type Answers } from "@/components/onboarding/Steps";
import { addGoal } from "@/lib/actions";
import { formatShortDate, toISODate } from "@/lib/dates";
import { perDayFor, splitAction } from "@/lib/onboarding";
import { startGoal } from "@/lib/start";
import { STARTERS } from "@/lib/starters";
import { DEFAULT_UNIT, validateGoal, type GoalValues } from "@/lib/validate";

type Step = "pick" | "what" | "often" | "date" | "amount" | "plan";

const BLANK: Answers = { starterKey: null, label: "", verb: "", unit: "", type: "daily", deadline: "", amount: 0, link: "" };

/** Only the questions this person needs: your own goal asks what and how often; a daily goal skips the date. */
function pathFor(a: Answers, picked: boolean): Step[] {
  const own: Step[] = picked && a.starterKey === null ? ["what", "often"] : [];
  const date: Step[] = a.type === "by-date" ? ["date"] : [];
  return ["pick", ...own, ...date, "amount", "plan"];
}

function goalFrom(a: Answers, today: string): GoalValues | null {
  const { verb, unit } = a.starterKey ? a : splitAction(a.label);
  return validateGoal({ verb, unit, type: a.type, target: String(a.amount), deadline: a.deadline, link: a.link }, today).value;
}

function startAnswers(starterKey: string | null): Answers {
  const s = STARTERS.find((x) => x.key === starterKey);
  return s ? { ...BLANK, starterKey: s.key, label: s.label, verb: s.verb, unit: s.unit, type: s.type, link: s.link ?? "" } : BLANK;
}

function questionFor(step: Step, a: Answers, unit: string): string {
  const named = a.label.charAt(0).toUpperCase() + a.label.slice(1);
  if (step === "what") return "Something else? Tell me what it is~";
  if (step === "often") return "How often do you want to do it?";
  if (step === "date") return `${named}, nice! When do you want to get there?`;
  if (step === "amount") return a.type === "daily" ? `How many ${unit} a day?` : `How many ${unit} by ${formatShortDate(a.deadline)}?`;
  return "Hi, I'm Titi! What have you been putting off?";
}

/** The first visit: Titi asks one thing per screen, every answer is a tap, and the last screen starts the first task. */
export function FirstVisit() {
  const today = toISODate(new Date());
  const [step, setStep] = useState<Step>("pick");
  const [answers, setAnswers] = useState<Answers>(BLANK);
  const [typing, setTyping] = useState(false);
  const [moved, setMoved] = useState(false);
  const path = pathFor(answers, step !== "pick");
  const index = path.indexOf(step);
  const unit = (answers.starterKey ? answers.unit : splitAction(answers.label).unit) || DEFAULT_UNIT;

  const go = (next: Answers, to: Step) => {
    setAnswers(next);
    setStep(to);
    setTyping(false);
    setMoved(true);
  };
  const answer = (change: Partial<Answers>) => {
    const next = { ...answers, ...change };
    const p = pathFor(next, true);
    go(next, p[p.indexOf(step) + 1]);
  };
  const back = () => go(answers, path[index - 1]);

  const goal = step === "plan" ? goalFrom(answers, today) : null;
  if (goal) {
    const perDay = perDayFor(goal.type, goal.target, answers.deadline, today);
    return <PlanStep goal={goal} perDay={perDay} onBack={back} onStart={() => startGoal(addGoal(goal, today))} />;
  }

  const shared = { answers, today, typing, onType: () => setTyping(true), onAnswer: answer };
  const question = questionFor(step, answers, unit);
  return (
    <SetupFrame step={index} steps={path.length} question={question} headingId={`setup-${step}`} moveFocus={moved} onBack={index > 0 ? back : undefined}>
      {step === "pick" && <PickStep onPick={(key) => go(startAnswers(key), pathFor(startAnswers(key), true)[1])} />}
      {step === "what" && <WhatStep {...shared} />}
      {step === "often" && <OftenStep {...shared} />}
      {step === "date" && <DateStep {...shared} />}
      {step === "amount" && <AmountStep {...shared} question={question} unit={unit} />}
    </SetupFrame>
  );
}
