"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import { quickAmounts } from "@/lib/phrases";
import { sessionLine, type BowlFill } from "@/lib/session";
import { siteName } from "@/lib/start";
import type { Goal } from "@/lib/types";
import { parseCount } from "@/lib/validate";
import { Bowl } from "./Bowl";
import { CatArt } from "./CatArt";
import { Coins } from "./Coins";

interface Props {
  goal: Goal;
  total: number;
  done: number;
  /** Titi's bowl for this goal today: it matches the bar, so the two never disagree. */
  bowl: BowlFill;
  /** Nothing was ever logged: Titi says how, once. */
  firstTime?: boolean;
  onLog: (amount: number) => void;
  onOpen: () => void;
}

/** "Did more than N?": one labelled field; the typed number stays on an error and focus returns to it. */
function MoreForm({
  total,
  onLog,
}: {
  total: number;
  onLog: (n: number) => void;
}) {
  const id = useId();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | undefined>();
  const ref = useRef<HTMLInputElement>(null);
  function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = parseCount(text);
    if (!parsed.ok) {
      setError(parsed.error);
      ref.current?.focus();
      return;
    }
    onLog(parsed.value);
    setText("");
  }
  return (
    <form onSubmit={submit} noValidate className="mt-4 flex items-end gap-3">
      <Field id={id} label={`More than ${total}? Type it`} error={error}>
        {(control) => (
          <TextInput
            {...control}
            ref={ref}
            autoFocus
            inputMode="numeric"
            autoComplete="off"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-28"
          />
        )}
      </Field>
      <Button type="submit" variant="secondary" className={error ? "mb-7" : ""}>
        Add
      </Button>
    </form>
  );
}

/** The lesson bar: back to Today, how far today's number has come, and the count. */
function SessionBar({ total, done }: { total: number; done: number }) {
  return (
    <div className="flex items-center gap-3">
      {/* The same back link as every other page under Today; the session itself is kept, so Today says "Keep going" */}
      <Link
        href="/"
        className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-muted underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-focus"
      >
        ← Today
      </Link>
      {/* With fish tiles the tiles are the progress; the bar only steps in for big numbers (reviewer, 2026-10-18) */}
      {total > 12 && (
        <>
      <div
        role="progressbar"
        aria-label="Today"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        className="h-4 flex-1 overflow-hidden rounded-full bg-wash-strong shadow-[inset_0_2px_0_rgba(0,0,0,.06)]"
      >
        <div
          className="bar-fill h-full rounded-full bg-reward shadow-[inset_0_3px_0_rgba(255,255,255,.35)]"
          style={{
            transform: `scaleX(${Math.min(done / Math.max(total, 1), 1)})`,
          }}
        />
      </div>
      <span
        aria-hidden="true"
        className="font-display text-lg font-semibold tabular-nums text-muted"
      >
        {done} / {total}
      </span>
        </>
      )}
    </div>
  );
}

/** Today's fish to tap (up to a dozen), or quick amounts when the number is bigger. */
function Amounts({ total, done, log }: { total: number; done: number; log: (n: number) => void }) {
  const left = Math.max(total - done, 0);
  if (total <= 12) {
    return <Coins total={total} done={done} label="Tap the last one you finished" onPick={(reached) => log(reached - done)} showCount={false} size="lg" />;
  }
  return (
    <div role="group" aria-label="How many did you do" className="flex flex-wrap gap-2">
      {quickAmounts(left).map((n) => (
        <Button key={n} variant="secondary" size="lg" className="min-w-16" onClick={() => log(n)}>
          {left > 0 && n === left ? `All ${n}` : n}
        </Button>
      ))}
    </div>
  );
}

/** Everything to tap in a session: the fish, "I finished one" (the one primary button), the site, and a batch. */
function LogPanel({ goal, total, done, log, onOpen }: { goal: Goal; total: number; done: number; log: (n: number) => void; onOpen: () => void }) {
  const [typing, setTyping] = useState(false);
  const site = siteName(goal.link);
  return (
    <div className="flex flex-col lg:mx-auto lg:w-full lg:max-w-md">
      <div className="mt-6 lg:mt-0">
        <Amounts total={total} done={done} log={log} />
      </div>

      {/* Open the page first, then log: the order of the work itself (reviewer, 2026-10-18) */}
      {site && (
        <Button
          variant="secondary"
          size="lg"
          className="mt-6 w-full"
          onClick={onOpen}
        >
          Open {site} <span aria-hidden="true">↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </Button>
      )}
      <Button size="lg" className={`${site ? "mt-3" : "mt-6"} w-full`} onClick={() => log(1)}>
        I finished one
      </Button>
      {typing ? (
        <MoreForm total={total} onLog={log} />
      ) : (
        <Button
          variant="ghost"
          className="mt-4 self-start"
          onClick={() => setTyping(true)}
        >
          Did more than {total}?
        </Button>
      )}
    </div>
  );
}

/** Working through today's number, like a lesson: a bar on top, Titi cheering, fish flying into the bowl as you log.
 *  Tapping a fish logs up to it (user, 2026-10-18: fish that cannot be tapped felt wrong); "I finished one" logs one;
 *  "Did more than N?" covers a batch. The session ends on its own when today is done. */
export function Session({ goal, total, done, bowl, firstTime = false, onLog, onOpen }: Props) {
  const id = useId();
  const [flight, setFlight] = useState<{ key: number; amount: number } | null>(null);
  const log = (amount: number) => {
    setFlight({ key: (flight?.key ?? 0) + 1, amount });
    onLog(amount);
  };

  return (
    <section aria-labelledby={`${id}-title`} className="flex flex-col pt-1 lg:flex-1">
      <SessionBar total={total} done={done} />

      {/* On a desktop: Titi, her bubble and the bowl on the left to look at; the fish and the buttons to tap on the right,
          the two halves centred on each other and in the space under the back link, so neither side leaves an empty corner */}
      <div className="lg:my-auto lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-12 lg:pb-16">
        <div className="flex flex-col lg:pb-6">
          <div className="mt-4 flex items-end gap-2">
            <CatArt key={flight?.key ?? 0} mood="idle" effect={flight ? "hop" : undefined} className="w-36 shrink-0 lg:w-52" />
            <div className="flat mb-8 rounded-2xl rounded-bl-sm bg-surface px-4 py-3">
              <ScreenHeading key={done} id={`${id}-title`} className="font-display text-xl font-semibold leading-snug text-ink lg:text-2xl">
                {sessionLine(done, total, firstTime)}
              </ScreenHeading>
            </div>
          </div>
          <div className="mt-2 self-center lg:mt-10 lg:scale-125">
            <Bowl fill={bowl} flight={flight} />
          </div>
        </div>
        <LogPanel goal={goal} total={total} done={done} log={log} onOpen={onOpen} />
      </div>
    </section>
  );
}
