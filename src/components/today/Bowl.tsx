"use client";

import type { BowlFill } from "@/lib/session";

interface Props {
  fill: BowlFill;
  /** Changes on every log: a fish flies into the bowl and the amount floats off it. */
  flight?: { key: number; amount: number } | null;
  className?: string;
}

const ART: Record<BowlFill, { src: string; label: string }> = {
  empty: { src: "/cat/bowl-empty.png", label: "Titi's bowl, empty" },
  some: { src: "/cat/bowl-some.png", label: "Titi's bowl, some fish in it" },
  full: { src: "/cat/bowl-full.png", label: "Titi's bowl, heaped full" },
};

/** Titi's bowl (art generated with GPT): fish pile up as today's number fills. */
export function Bowl({ fill, flight = null, className = "w-40" }: Props) {
  const art = ART[fill];
  return (
    <div className={`relative ${className}`} role="img" aria-label={art.label}>
      {/* eslint-disable-next-line @next/next/no-img-element -- painted art, sized by the parent */}
      <img src={art.src} alt="" className="block h-auto w-full" />
      {flight && (
        <div key={flight.key} aria-hidden="true" className="absolute inset-x-0 top-0 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative */}
          <img src="/cat/fish.png" alt="" className="fish-fly w-12" />
          <span className="plus-one absolute -top-3 right-4 font-display text-2xl font-semibold text-reward-deep">+{flight.amount}</span>
        </div>
      )}
    </div>
  );
}
