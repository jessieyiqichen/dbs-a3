"use client";

import { useState } from "react";
import { GoalCard } from "@/components/goals/GoalCard";
import { CatArt } from "@/components/today/CatArt";
import { Coins } from "@/components/today/Coins";
import { ShelfBowl } from "@/components/today/Room";
import { StreakChip } from "@/components/today/StreakChip";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Bubble } from "@/components/ui/Bubble";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { GoalSwitch } from "@/components/ui/GoalSwitch";
import { Label } from "@/components/ui/Label";
import { Meter } from "@/components/ui/Meter";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { ToastPanel } from "@/components/ui/Toast";
import { SAMPLE_GOAL, SAMPLE_PLAN, SAMPLE_WEEK } from "./sample";
import { Section, Specimen } from "./Section";

const GOALS = [
  { id: "a", name: "Connection requests", done: false },
  { id: "b", name: "Applications", done: true },
  { id: "c", name: "Interview questions", done: false },
];

function Controls() {
  const [often, setOften] = useState<"daily" | "by-date">("daily");
  const [current, setCurrent] = useState("a");
  const [fish, setFish] = useState(2);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Specimen name="Buttons: primary (one per screen), secondary, ghost, danger">
        <Button>Start</Button>
        <Button variant="secondary">Open LinkedIn <span aria-hidden="true">↗</span></Button>
        <Button variant="ghost">Did more than 5?</Button>
        <Button variant="danger">Remove goal</Button>
      </Specimen>
      <Specimen name="Arrow link: goes to another page, no box">
        <ArrowLink href="#ds-4">38 connection requests all time</ArrowLink>
      </Specimen>
      <Specimen name="Goal switch: the current goal is a label, the others are pills" className="lg:col-span-2">
        <GoalSwitch goals={GOALS} current={current} onPick={setCurrent} />
      </Specimen>
      <Specimen name="Text field with label and hint (time and date use the same field)">
        <div className="w-full">
          <Field id="ds-amount" label="How many each day?" hint="A whole number, like 5">
            {(c) => <TextInput {...c} defaultValue="5" inputMode="numeric" className="w-28" />}
          </Field>
        </div>
      </Specimen>
      <Specimen name="Radio rows: one question, a few answers">
        <div className="w-full">
          <RadioGroup name="ds-often" legend="How often?" value={often} onChange={setOften} options={[{ value: "daily", label: "Every day" }, { value: "by-date", label: "A total by a date" }]} />
        </div>
      </Specimen>
      <Specimen name="Choice row: tap to answer and move on (first visit)">
        <Button variant="choice" size="lg" className="w-full py-2 text-left">
          <span className="flex flex-1 flex-col">In a month<span className="t-label text-muted">By Nov 18</span></span>
          <span aria-hidden="true" className="text-muted">→</span>
        </Button>
      </Specimen>
      <Specimen name="Fish tiles: tap the last one you finished; bare fish only show a count">
        <Coins total={5} done={fish} label="Today" onPick={setFish} showCount={false} />
        <Coins total={3} done={1} label="Plan" showCount={false} />
      </Specimen>
    </div>
  );
}

function Display() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Specimen name="Card: a goal in the list (the whole card is a link)">
        <ul className="w-full">
          <GoalCard goal={SAMPLE_GOAL} plan={SAMPLE_PLAN} today="2026-10-18" />
        </ul>
      </Specimen>
      <Specimen name="Label above the sentence it names, then the sentence (Display)">
        <div>
          <Label>Connection requests</Label>
          <p className="t-display mt-1 text-ink">Send 5 connection requests</p>
          <p className="t-body mt-1 text-muted">You&apos;ve got this, start with one!</p>
        </div>
      </Specimen>
      <Specimen name="Titi and her bubble: the only read-only shape with a backing">
        <CatArt mood="idle" className="w-20 shrink-0" />
        <Bubble><p className="t-heading text-ink">Tap a fish, or I finished one</p></Bubble>
      </Specimen>
      <Specimen name="Badge on the painting, and the honey meter for progress">
        <StreakChip days={3} />
        <div className="flex w-full flex-col gap-1">
          <Meter value={38} max={150} label="Road to 150" />
          <p className="t-label text-muted">38 of 150</p>
        </div>
      </Specimen>
      <Specimen name="List rows: this week's bowls, one per day" className="lg:col-span-2">
        <ol aria-label="This week" className="flex w-full items-end gap-1">
          {SAMPLE_WEEK.map((b) => <ShelfBowl key={b.date} bowl={b} />)}
        </ol>
      </Specimen>
      <Specimen name="Toast with Undo: the confirmation after a log">
        <ToastPanel message="Added 1 connection request" onUndo={() => undefined} />
      </Specimen>
    </div>
  );
}

export function Components() {
  return (
    <Section n={4} title="Components" note="The shared pieces, each used the same way on every page">
      <div className="flex flex-col gap-6">
        <Controls />
        <Display />
      </div>
    </Section>
  );
}
