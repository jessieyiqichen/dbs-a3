"use client";

import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { goalPillClass } from "@/components/ui/GoalSwitch";
import { Label } from "@/components/ui/Label";
import { ToastPanel } from "@/components/ui/Toast";
import { Section, Specimen } from "./Section";

const STATES = ["Rest", "Hover", "Focus", "Pressed", "Selected", "Disabled"] as const;
const FOCUS = "is-focused";
const LINK_FOCUS = "-mx-2 rounded-tile px-2 outline-3 outline-offset-0 outline-focus";
const NOT_USED = <span className="t-label text-muted">Not used</span>;

function Fish({ earned = false }: { earned?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element -- a tiny decorative icon
  return <img src={earned ? "/cat/fish.png" : "/cat/fish-locked.png"} alt="" aria-hidden="true" className="w-full" />;
}

const tile = "clay clay-press flex h-12 w-12 items-center justify-center rounded-tile px-1";
const link = "t-body font-extrabold underline decoration-2 underline-offset-4";
const input = "min-h-12 w-32 rounded-tile border-2 bg-surface px-3 text-base font-bold text-ink";

/** Each control drawn in every state at once; the classes are the ones the live control uses. */
const ROWS: { name: string; cells: ReactNode[] }[] = [
  {
    name: "Primary button",
    cells: [
      <span key="r" className={buttonClass({})}>Start</span>,
      <span key="h" className={buttonClass({}).replace("bg-primary ", "bg-primary-hover ")}>Start</span>,
      <span key="f" className={`${buttonClass({})} ${FOCUS}`}>Start</span>,
      <span key="p" className={`${buttonClass({})} is-pressed`}>Start</span>,
      NOT_USED,
      <button key="d" type="button" disabled tabIndex={-1} className={buttonClass({})}>Start</button>,
    ],
  },
  {
    name: "Secondary button",
    cells: [
      <span key="r" className={buttonClass({ variant: "secondary" })}>Edit goal</span>,
      <span key="h" className={buttonClass({ variant: "secondary" }).replace("bg-surface ", "bg-wash ")}>Edit goal</span>,
      <span key="f" className={`${buttonClass({ variant: "secondary" })} ${FOCUS}`}>Edit goal</span>,
      <span key="p" className={`${buttonClass({ variant: "secondary" })} is-pressed`}>Edit goal</span>,
      NOT_USED,
      <button key="d" type="button" disabled tabIndex={-1} className={buttonClass({ variant: "secondary" })}>Edit goal</button>,
    ],
  },
  {
    name: "Goal pill",
    cells: [
      <span key="r" className={goalPillClass}>Applications</span>,
      <span key="h" className={goalPillClass.replace("bg-surface ", "bg-wash ")}>Applications</span>,
      <span key="f" className={`${goalPillClass} ${FOCUS}`}>Applications</span>,
      <span key="p" className={`${goalPillClass} is-pressed`}>Applications</span>,
      <Label key="s" as="span">Applications</Label>,
      NOT_USED,
    ],
  },
  {
    name: "Fish tile",
    cells: [
      <span key="r" className={`${tile} bg-surface`}><Fish /></span>,
      <span key="h" className={`${tile} bg-wash`}><Fish /></span>,
      <span key="f" className={`${tile} bg-surface ${FOCUS}`}><Fish /></span>,
      <span key="p" className={`${tile} bg-surface is-pressed`}><Fish /></span>,
      <span key="s" className={`${tile} bg-reward-soft [--lip:var(--color-reward)]`}><Fish earned /></span>,
      NOT_USED,
    ],
  },
  {
    name: "Arrow link",
    cells: [
      <span key="r" className={`${link} text-muted`}>All time →</span>,
      <span key="h" className={`${link} text-ink`}>All time →</span>,
      <span key="f" className={`${link} inline-flex min-h-11 items-center text-muted ${LINK_FOCUS}`}>All time →</span>,
      <span key="p" className={`${link} text-ink`}>All time →</span>,
      NOT_USED,
      NOT_USED,
    ],
  },
  {
    name: "Text field",
    cells: [
      <span key="r" className={`${input} border-line inline-flex items-center`}>5</span>,
      NOT_USED,
      <span key="f" className={`${input} border-ink inline-flex items-center outline-3 outline-offset-0 outline-focus`}>5</span>,
      NOT_USED,
      NOT_USED,
      <span key="d" className={`${input} border-line inline-flex items-center opacity-50`}>5</span>,
    ],
  },
];

export function ControlStates() {
  return (
    <Section n={5} title="Control states" note="Rest, hover, focus, pressed, selected and disabled, where each applies">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] border-separate border-spacing-y-4 text-left">
          <thead>
            <tr>
              <th scope="col" className="t-label pr-4 text-muted"><span className="sr-only">Control</span></th>
              {STATES.map((s) => <th key={s} scope="col" className="t-label pr-4 text-muted">{s}</th>)}
            </tr>
          </thead>
          <tbody aria-hidden="true">
            {ROWS.map((r) => (
              <tr key={r.name}>
                <th scope="row" className="t-body pr-4 font-extrabold text-ink">{r.name}</th>
                {r.cells.map((c, i) => <td key={i} className="whitespace-nowrap pr-4 align-middle">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="t-label mt-2 text-muted">Pressing sinks a clay control onto its lip. Selected is a state of choice: the current goal and an earned fish. Focus is one 3px ink ring in the control's own shape; on clay it wraps the lip too</p>
    </Section>
  );
}

export function UIStates() {
  return (
    <Section n={6} title="UI states" note="Empty, loading, error and success, as Nudge says them">
      <div className="grid gap-6 sm:grid-cols-2">
        <Specimen name="Empty: Goals with nothing saved">
          <div className="flex flex-col gap-3">
            <p className="t-body text-ink">No goals yet, Titi is waiting</p>
            <span className={buttonClass({ className: "self-start" })}>Add a goal</span>
          </div>
        </Specimen>
        <Specimen name="Loading: the page's shapes, quiet">
          <div aria-hidden="true" className="flex w-full flex-col gap-2">
            <div className="h-4 w-24 animate-pulse rounded-full bg-wash motion-reduce:animate-none" />
            <div className="h-8 w-full animate-pulse rounded-tile bg-wash motion-reduce:animate-none" />
            <div className="h-11 w-full animate-pulse rounded-full bg-wash motion-reduce:animate-none" />
          </div>
        </Specimen>
        <Specimen name="Error: beside the field, what to do next, what you typed kept">
          <div className="w-full">
            <Field id="ds-error" label="Did more than 5?" error="Enter a whole number, like 30">
              {(c) => <TextInput {...c} defaultValue="abc" className="w-28" />}
            </Field>
          </div>
        </Specimen>
        <Specimen name="Success: a toast with Undo">
          <ToastPanel message="Added 1 connection request" onUndo={() => undefined} />
        </Specimen>
      </div>
    </Section>
  );
}
