"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ScreenHeading } from "@/components/ui/ScreenHeading";
import { countOf } from "@/lib/phrases";
import type { BowlDay } from "@/lib/scene";
import { doneStats, type DoneStat } from "@/lib/session";
import type { Goal } from "@/lib/types";
import { useCountUp } from "@/lib/useCountUp";
import { CatArt } from "./CatArt";
import { ShelfBowl } from "./Room";

interface Props {
  /** Shown under the celebration: the moment something useful is done is when to ask. */
  prompt?: ReactNode;
  goal: Goal;
  doneToday: number;
  doneTotal: number;
  streakDays: number;
  /** "Halfway there!" when today crossed a quarter of the road. */
  milestone?: string | null;
  next: Goal | null;
  onStartNext: () => void;
  /** Back to Titi's room. */
  onContinue: () => void;
  /** This week's bowls, for the streak moment. */
  bowls: BowlDay[];
  /** The first goal finished today: the streak gets its own moment after the results, like a finished lesson's. */
  streakMoment?: boolean;
}

/** Each result is a badge with its own colour, a coloured strip with its name and an icon, like a lesson-complete
 *  screen. Badges are celebration, not controls: flat colour and a border, never the clay lip. */
const BADGE = [
  {
    band: "bg-reward",
    edge: "border-reward",
    number: "text-reward-deep",
    icon: "/cat/fish.png",
  },
  {
    band: "bg-primary",
    edge: "border-primary",
    number: "text-lip",
    icon: "/cat/bowl-full.png",
  },
  { band: "bg-sky", edge: "border-sky", number: "text-sky-deep", icon: null },
];

function Flag() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7">
      <path
        d="M6 3v18"
        stroke="var(--color-reward-deep)"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path
        d="M7 4c4-1.5 7 1.5 11 0l-2 4 2 4c-4 1.5-7-1.5-11 0z"
        fill="var(--color-flag)"
      />
    </svg>
  );
}

/** One badge: it bounces in after the one before it and its number counts up. */
function Badge({ stat, index }: { stat: DoneStat; index: number }) {
  const shown = useCountUp(stat.value, 500 + index * 220);
  const look = BADGE[index];
  const suffix = stat.unit
    ? shown === 1
      ? stat.unit.one
      : stat.unit.many
    : stat.suffix;
  return (
    <li
      className={`badge-in flex flex-1 flex-col overflow-hidden rounded-2xl border-2 bg-surface ${look.edge}`}
      style={{ ["--delay" as string]: `${0.35 + index * 0.22}s` }}
    >
      <span
        className={`px-1 py-1 text-center font-display text-sm font-semibold text-ink ${look.band}`}
      >
        {stat.label}
      </span>
      <span className="flex items-center justify-center gap-1 whitespace-nowrap px-1 py-3">
        {look.icon ? (
          // eslint-disable-next-line @next/next/no-img-element -- a small decorative icon
          <img src={look.icon} alt="" aria-hidden="true" className="w-6" />
        ) : (
          <Flag />
        )}
        <span
          aria-hidden="true"
          className={`font-display text-xl font-bold tabular-nums ${look.number}`}
        >
          {shown}
          {suffix}
        </span>
        <span className="sr-only">
          {stat.value}
          {stat.unit
            ? stat.value === 1
              ? stat.unit.one
              : stat.unit.many
            : stat.suffix}
        </span>
      </span>
    </li>
  );
}

/** Slow light rays behind Titi, in the sun colour, like the burst behind a finished lesson. */
function Rays() {
  const wedges = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    // The turning square is clipped to a circle, so its corners never widen the page on a phone
    <div
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 -z-10 size-[150%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
    >
      <svg viewBox="-100 -100 200 200" className="rays size-full">
        {wedges.map((a) => (
          <path
            key={a}
            d="M0,0 L-9,-100 L9,-100 Z"
            transform={`rotate(${a})`}
            fill="var(--color-sun)"
            opacity={0.8}
          />
        ))}
        <circle r={46} fill="var(--color-sun)" />
      </svg>
    </div>
  );
}

/** One shower of fish treats and hearts across the screen, once. Hidden under reduced motion. */
function Confetti() {
  const pieces = Array.from({ length: 16 }, (_, i) => ({
    left: (i * 61) % 100,
    delay: (i % 6) * 0.14,
    fall: 2.2 + (i % 5) * 0.25,
    sway: ((i % 4) - 1.5) * 26,
    spin: (i % 2 ? 1 : -1) * (200 + (i % 3) * 120),
    fish: i % 3 !== 0,
  }));
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti absolute top-0"
          style={{
            left: `${p.left}%`,
            ["--delay" as string]: `${p.delay}s`,
            ["--fall" as string]: `${p.fall}s`,
            ["--sway" as string]: `${p.sway}px`,
            ["--spin" as string]: `${p.spin}deg`,
          }}
        >
          {p.fish ? (
            // eslint-disable-next-line @next/next/no-img-element -- decorative
            <img src="/cat/fish.png" alt="" className="w-8" />
          ) : (
            <svg viewBox="0 0 24 24" className="size-5">
              <path
                d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.2 0 3.6 1.3 5.3 3.2 1.7-1.9 3.1-3.2 5.3-3.2 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z"
                fill="var(--color-heart)"
              />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}

/** What comes after: the next goal, or back to Titi's room, and the nudge question when it is due. */
function Onward({
  next,
  onStartNext,
  onContinue,
  prompt,
}: Pick<Props, "next" | "onStartNext" | "onContinue" | "prompt">) {
  return (
    <>
      <div className="mt-8 flex w-full flex-col items-center gap-3">
        {next ? (
          <>
            <Button size="lg" onClick={onStartNext} className="w-full">
              Next: {next.title} →
            </Button>
            <Button variant="ghost" onClick={onContinue}>
              Or stop here, today counts
            </Button>
          </>
        ) : (
          <Button size="lg" onClick={onContinue} className="w-full">
            Back to Titi&apos;s room
          </Button>
        )}
      </div>
      {prompt && <div className="mt-6 w-full text-left">{prompt}</div>}
    </>
  );
}

/** The streak's own moment, once a day: the count in big honey numbers and this week's bowls, today's popping in. */
function StreakMoment({
  days,
  bowls,
  children,
}: {
  days: number;
  bowls: BowlDay[];
  children: ReactNode;
}) {
  const shown = useCountUp(days, 250);
  return (
    <section
      aria-labelledby="streak-title"
      className="relative flex flex-col items-center pt-10 text-center"
    >
      <div aria-hidden="true" className="fixed inset-0 -z-20 bg-celebrate" />
      <div className="relative flex size-44 items-center justify-center">
        <Rays />
        {/* eslint-disable-next-line @next/next/no-img-element -- the fish treat, the streak's mark */}
        <img
          src="/cat/fish.png"
          alt=""
          aria-hidden="true"
          className="pop-in w-28"
        />
      </div>
      <p
        aria-hidden="true"
        className="mt-4 font-display text-7xl font-bold tabular-nums text-reward-deep"
      >
        {shown}
      </p>
      <ScreenHeading
        id="streak-title"
        className="font-display text-3xl font-bold text-ink"
      >
        {days}-day streak!
      </ScreenHeading>
      <p className="mt-1 font-display text-lg font-semibold text-muted">
        Come back tomorrow to keep it going
      </p>
      <ol aria-label="This week" className="mt-8 flex w-full items-end gap-1">
        {bowls.map((b) => (
          <ShelfBowl key={b.date} bowl={b} pop={b.today} />
        ))}
      </ol>
      {children}
    </section>
  );
}

/** The reward when today's number is reached, like a lesson-complete screen: light rays and Titi jumping for joy, a
 *  shower of fish once, what you did in words, three badges that bounce in and count up. On the first finish of the
 *  day "Continue" leads to the streak's own moment; otherwise the next step is right here. */
export function DoneToday({
  prompt,
  goal,
  doneToday,
  doneTotal,
  streakDays,
  milestone = null,
  next,
  onStartNext,
  onContinue,
  bowls,
  streakMoment = false,
}: Props) {
  const [stage, setStage] = useState<"results" | "streak">("results");
  const stats = doneStats(goal, { doneToday, doneTotal, streakDays });
  const onward = (
    <Onward
      next={next}
      onStartNext={onStartNext}
      onContinue={onContinue}
      prompt={prompt}
    />
  );
  if (stage === "streak")
    return (
      <StreakMoment days={streakDays} bowls={bowls}>
        {onward}
      </StreakMoment>
    );
  return (
    <section
      aria-labelledby="done-title"
      className="relative flex flex-col items-center pt-2 text-center"
    >
      <div aria-hidden="true" className="fixed inset-0 -z-20 bg-celebrate" />
      <Confetti />
      <div className="relative mt-4 w-52">
        <Rays />
        <CatArt
          mood="celebrate"
          effect="party"
          sun={false}
          className="pop-in w-52"
        />
      </div>
      <ScreenHeading
        id="done-title"
        className="mt-4 font-display text-4xl font-bold text-ink"
      >
        Done for today!
      </ScreenHeading>
      <p className="mt-1 font-display text-xl font-semibold text-ink">
        {countOf(doneToday, goal.unit)} done, Titi is so proud!
      </p>
      <ul aria-label="Today's results" className="mt-6 flex w-full gap-3">
        {stats.map((stat, i) => (
          <Badge key={stat.label} stat={stat} index={i} />
        ))}
      </ul>
      {milestone && (
        <p
          className="badge-in mt-5 font-display text-xl font-semibold text-ink"
          style={{ ["--delay" as string]: "1.1s" }}
        >
          {milestone}
        </p>
      )}
      {streakMoment && streakDays > 0 ? (
        <div className="mt-8 w-full">
          <Button
            size="lg"
            onClick={() => setStage("streak")}
            className="w-full"
          >
            Continue
          </Button>
        </div>
      ) : (
        onward
      )}
    </section>
  );
}
