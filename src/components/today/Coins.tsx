"use client";

/** Up to a dozen, today's number shows as fish treats for Titi; beyond that a bar says it more clearly. */
const MAX_FISH = 12;

/** Fish per row, balanced so 9 sits as 5 + 4, not 8 + 1. */
function perRow(total: number): number {
  const rows = Math.ceil(total / 6);
  return Math.ceil(total / rows);
}

interface Props {
  total: number;
  done: number;
  /** Names the group for screen readers, e.g. "Today". */
  label: string;
  /** When set, each fish past `done` is a button: tapping fish n means "I'm at n now". */
  onPick?: (reached: number) => void;
}

function Fish({ earned }: { earned: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element -- a tiny decorative icon, repeated; no layout shift to manage
  return <img src={earned ? "/cat/fish.png" : "/cat/fish-locked.png"} alt="" aria-hidden="true" className="w-full" />;
}

/** Today's number as fish treats you can see fill up, with the count beside them so it never rests on colour alone. */
export function Coins({ total, done, label, onPick }: Props) {
  const count = <p aria-hidden="true" className="mt-2 font-display text-lg font-semibold text-muted">{done} / {total}</p>;

  if (total > MAX_FISH) {
    const pct = Math.min(100, Math.round((done / Math.max(total, 1)) * 100));
    return (
      <div>
        <div role="img" aria-label={`${label}: ${done} of ${total} done`} className="h-5 overflow-hidden rounded-full bg-reward-soft">
          <div className="h-full rounded-full bg-reward" style={{ width: `${pct}%` }} />
        </div>
        {count}
      </div>
    );
  }

  const cell = "flex h-11 items-center rounded-xl";
  const fish = Array.from({ length: total }, (_, i) => i + 1);
  const grid = { gridTemplateColumns: `repeat(${perRow(total)}, 3rem)` };

  if (!onPick) {
    return (
      <div>
        <div role="img" aria-label={`${label}: ${done} of ${total} done`} className="grid gap-x-2 gap-y-1" style={grid}>
          {fish.map((n) => <span key={n} className={cell}><Fish earned={n <= done} /></span>)}
        </div>
        {count}
      </div>
    );
  }

  return (
    <div>
      <div role="group" aria-label={label} className="grid gap-x-2 gap-y-1" style={grid}>
        {fish.map((n) =>
          n <= done ? (
            <span key={n} className={cell}><Fish earned /></span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPick(n)}
              aria-label={`I'm at ${n}`}
              className={`${cell} px-0.5 transition hover:bg-wash active:translate-y-px active:bg-wash-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus`}
            >
              <Fish earned={false} />
            </button>
          ),
        )}
      </div>
      {count}
    </div>
  );
}
