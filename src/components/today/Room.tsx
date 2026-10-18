"use client";

import { useEffect, useState, type ReactNode } from "react";
import { formatShortDate } from "@/lib/dates";
import { timeOfDay, weekdayLetter, type BowlDay, type TimeOfDay } from "@/lib/scene";
import type { BowlFill } from "@/lib/session";
import { CatArt, type CatEffect, type CatMood } from "./CatArt";

const TIMES: TimeOfDay[] = ["morning", "dusk", "night"];
const BOWL: Record<BowlFill, string> = { empty: "/cat/bowl-empty.png", some: "/cat/bowl-some.png", full: "/cat/bowl-full.png" };

/** The current hour, refreshed every minute so the window changes while the page stays open. */
function useHour(): number {
  const [hour, setHour] = useState(() => new Date().getHours());
  useEffect(() => {
    const id = window.setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return hour;
}

/** The window (art generated with GPT) as a short banner: the sky says what time it is, nothing is drawn over it. */
function Window({ time, corner }: { time: TimeOfDay; corner?: ReactNode }) {
  return (
    <div className="relative aspect-[1040/457] w-full overflow-hidden rounded-3xl bg-wash">
      {TIMES.map((t) => (
        // eslint-disable-next-line @next/next/no-img-element -- three paintings cross-fade; next/image would reload on each swap
        <img key={t} src={`/cat/window-${t}.webp`} alt="" aria-hidden="true" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${t === time ? "opacity-100" : "opacity-0"}`} />
      ))}
      {corner && <div className="absolute left-3 top-3">{corner}</div>}
      {/* The "morning" painting is the daytime sky (5:00 to 15:59), so it is read out as daytime */}
      <span className="sr-only">Titi&apos;s window, {time === "morning" ? "daytime" : time}</span>
    </div>
  );
}

/** One bowl on a shelf; labelled by weekday letter on Today, by day of the month in the diary. */
export function ShelfBowl({ bowl, label = "letter" }: { bowl: BowlDay; label?: "letter" | "day" }) {
  const { letter, name } = weekdayLetter(bowl.date);
  const text = label === "letter" ? letter : String(Number(bowl.date.slice(8)));
  const said = bowl.future ? "not yet" : bowl.fill === "full" ? "all done" : bowl.fill === "some" ? "some done" : "nothing yet";
  return (
    <li className={`relative flex flex-1 flex-col items-center ${bowl.future ? "opacity-45" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- painted art */}
      <img src={BOWL[bowl.fill]} alt="" aria-hidden="true" className="relative w-full max-w-11 drop-shadow-[0_3px_2px_rgba(90,60,20,.25)]" />
      {/* Today wears a small honey tag under its bowl, like the date on a calendar */}
      <span aria-hidden="true" className={`mt-1 min-w-5 rounded-full px-1.5 text-center text-[11px] font-extrabold leading-5 ${bowl.today ? "bg-reward text-ink shadow-[0_2px_0_var(--color-reward-deep)]" : "text-muted"}`}>{text}</span>
      <span className="sr-only">{bowl.today ? "Today" : `${name} ${formatShortDate(bowl.date)}`}: {said}</span>
    </li>
  );
}

/** This week as seven of Titi's bowls on a clay shelf: fish in the days that got something, heaped when the day was done.
 *  On a phone the shelf stays at the foot of the screen while the room scrolls (status, not navigation: nothing on it is a
 *  button); from 640px up it sits in the page under the room. */
function Shelf({ bowls }: { bowls: BowlDay[] }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-reward-soft bg-page/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm sm:static sm:border-0 sm:bg-transparent sm:pb-0 sm:backdrop-blur-none">
      <div className="clay mx-auto max-w-xl rounded-t-2xl bg-reward-soft px-3 pb-1 pt-1.5 [--lip:var(--color-reward)] sm:rounded-2xl sm:pb-2 sm:pt-2">
        <p className="mb-1 text-center text-xs font-extrabold text-muted max-sm:sr-only">Titi&apos;s week, every goal counts!</p>
        <ol aria-label="Titi's week, every goal counts" className="flex items-end gap-1">
          {bowls.map((b) => <ShelfBowl key={b.date} bowl={b} />)}
        </ol>
      </div>
    </div>
  );
}

interface Props {
  bowls: BowlDay[];
  cat: { mood: CatMood; effect?: CatEffect; key?: string };
  corner?: ReactNode;
  /** Today's goal and its one button, placed right under Titi. */
  children?: ReactNode;
}

/** Titi's room, in layers that never overlap: the window banner, Titi with her drawn animations on a clay mat, the goal
 *  and its button, and the week's bowls on a shelf. Each piece is whole art or plain interface, so nothing is stitched.
 *  On a phone the shelf is fixed at the foot of the screen, so Titi stays big and the button still lands on the first
 *  screen (user, 2026-10-18: Titi is the design, she must be seen). */
export function Room({ bowls, cat, corner, children }: Props) {
  const time = timeOfDay(useHour());
  return (
    <div className="flex flex-col gap-4 max-sm:pb-24 lg:grid lg:grid-cols-2 lg:grid-rows-[auto_auto_auto] lg:items-start lg:gap-x-10 lg:gap-y-5">
      <div className="lg:col-start-1 lg:row-start-1"><Window time={time} corner={corner} /></div>
      <div className="relative mx-auto flex w-52 flex-col items-center lg:col-start-1 lg:row-start-2 lg:w-64 lg:py-2">
        <span aria-hidden="true" className="clay absolute bottom-1 left-1/2 h-10 w-48 -translate-x-1/2 rounded-full bg-sun [--lip:#e9cf7e] lg:h-12 lg:w-60" />
        <CatArt key={cat.key} mood={cat.mood} effect={cat.effect} sun={false} className="relative w-40 lg:w-52" />
      </div>
      <div className="flex flex-col gap-4 lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:sticky lg:top-6">{children}</div>
      <div className="lg:col-start-1 lg:row-start-3"><Shelf bowls={bowls} /></div>
    </div>
  );
}

/** While the saved data loads (a moment): the room's shapes, quiet, so nothing jumps when it arrives. */
export function RoomSkeleton() {
  const block = "animate-pulse rounded-3xl bg-wash motion-reduce:animate-none";
  return (
    <div aria-busy="true" aria-label="Loading your goals" className="flex flex-col gap-4 pt-2">
      <div className={`${block} aspect-[1040/457] w-full`} />
      <div className={`${block} mx-auto h-40 w-40 rounded-full`} />
      <div className={`${block} h-10 w-56 rounded-full`} />
      <div className={`${block} h-20 w-full`} />
      <div className={`${block} h-14 w-full rounded-2xl`} />
    </div>
  );
}
