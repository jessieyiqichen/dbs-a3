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
  /** Off when the number is already shown nearby (the session's bar). */
  showCount?: boolean;
}

function Fish({ earned }: { earned: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element -- a tiny decorative icon, repeated; no layout shift to manage
  return <img src={earned ? "/cat/fish.png" : "/cat/fish-locked.png"} alt="" aria-hidden="true" className="w-full" />;
}

/** Today's number as fish treats you can see fill up, with the count beside them so it never rests on colour alone. */
export function Coins({ total, done, label, onPick, showCount = true }: Props) {
  const count = showCount ? <p aria-hidden="true" className="mt-2 font-display text-lg font-semibold tabular-nums text-muted">{done} / {total}</p> : null;

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

  // Clay tiles: an earned one sits on a honey lip, one still to go on a plain lip.
  const cell = "clay flex h-12 w-12 items-center justify-center rounded-xl px-1";
  const tile = (earned: boolean) => `${cell} ${earned ? "bg-reward-soft [--lip:var(--color-reward)]" : "bg-surface"}`;
  const fish = Array.from({ length: total }, (_, i) => i + 1);
  const grid = { gridTemplateColumns: `repeat(${perRow(total)}, 3rem)` };

  if (!onPick) {
    return (
      <div>
        <div role="img" aria-label={`${label}: ${done} of ${total} done`} className="grid gap-x-3 gap-y-3" style={grid}>
          {fish.map((n) => <span key={n} className={tile(n <= done)}><Fish earned={n <= done} /></span>)}
        </div>
        {count}
      </div>
    );
  }

  return (
    <div>
      <div role="group" aria-label={label} className="grid gap-x-3 gap-y-3" style={grid}>
        {fish.map((n) =>
          n <= done ? (
            <span key={n} className={tile(true)}><Fish earned /></span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPick(n)}
              aria-label={`I'm at ${n}`}
              className={`${tile(false)} clay-press hover:bg-wash focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus`}
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
