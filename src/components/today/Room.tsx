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
      <span className="sr-only">Titi&apos;s window, {time}</span>
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

/** This week as seven of Titi's bowls on a clay shelf: fish in the days that got something, heaped when the day was done. */
function Shelf({ bowls }: { bowls: BowlDay[] }) {
  return (
    <div className="clay rounded-2xl bg-reward-soft px-3 pb-2 pt-2 [--lip:var(--color-reward)]">
      <p className="mb-1 text-center text-xs font-extrabold text-muted">Titi&apos;s week, every goal counts!</p>
      <ol aria-label="Titi's week" className="flex items-end gap-1">
        {bowls.map((b) => <ShelfBowl key={b.date} bowl={b} />)}
      </ol>
    </div>
  );
}

interface Props {
  bowls: BowlDay[];
  cat: { mood: CatMood; effect?: CatEffect; key?: string };
  corner?: ReactNode;
}

/** Titi's room, in layers that never overlap: the window banner, Titi with her drawn animations on a clay mat,
 *  and the week's bowls on a shelf. Each piece is whole art or plain interface, so nothing is stitched. */
export function Room({ bowls, cat, corner }: Props) {
  const time = timeOfDay(useHour());
  return (
    <div className="flex flex-col gap-4">
      <Window time={time} corner={corner} />
      <div className="relative mx-auto flex w-56 flex-col items-center">
        <span aria-hidden="true" className="clay absolute bottom-1 left-1/2 h-10 w-52 -translate-x-1/2 rounded-full bg-sun [--lip:#e9cf7e]" />
        <CatArt key={cat.key} mood={cat.mood} effect={cat.effect} sun={false} className="relative w-44" />
      </div>
      <Shelf bowls={bowls} />
    </div>
  );
}

/** While the saved data loads (a moment): the room's shapes, quiet, so nothing jumps when it arrives. */
export function RoomSkeleton() {
  const block = "animate-pulse rounded-3xl bg-wash motion-reduce:animate-none";
  return (
    <div aria-busy="true" aria-label="Loading your goals" className="flex flex-col gap-4 pt-2">
      <div className={`${block} aspect-[1040/457] w-full`} />
      <div className={`${block} mx-auto h-40 w-44 rounded-full`} />
      <div className={`${block} h-20 w-full rounded-2xl`} />
      <div className={`${block} mx-auto h-20 w-full max-w-[430px]`} />
      <div className={`${block} mx-auto h-14 w-full max-w-[430px] rounded-2xl`} />
    </div>
  );
}
