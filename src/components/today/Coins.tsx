"use client";

/** Up to a dozen, today's number shows as coins; beyond that a bar says it more clearly. */
const MAX_COINS = 12;

/** Coins per row, balanced so 9 sits as 5 + 4, not 8 + 1. */
function perRow(total: number): number {
  const rows = Math.ceil(total / 6);
  return Math.ceil(total / rows);
}

interface Props {
  total: number;
  done: number;
  /** Names the group for screen readers, e.g. "Today". */
  label: string;
  /** When set, each coin past `done` is a button: tapping coin n means "I'm at n now". */
  onPick?: (reached: number) => void;
}

/** Today's number as something you can see fill up. Done coins are gold; the rest wait in the wash. */
export function Coins({ total, done, label, onPick }: Props) {
  if (total > MAX_COINS) {
    const pct = Math.min(100, Math.round((done / Math.max(total, 1)) * 100));
    return (
      <div className="flex flex-col gap-2">
        <div role="img" aria-label={`${label}: ${done} of ${total} done`} className="h-7 overflow-hidden rounded-full border-3 border-ink bg-wash">
          <div className="h-full rounded-full bg-reward" style={{ width: `${pct}%` }} />
        </div>
        <p aria-hidden="true" className="font-display text-xl font-semibold text-ink">{done} / {total}</p>
      </div>
    );
  }

  const coin = "size-11 rounded-full border-3 border-ink transition";
  const filled = "bg-reward shadow-[inset_0_-4px_0_var(--color-reward-deep)]";
  const empty = "bg-wash";
  const coins = Array.from({ length: total }, (_, i) => i + 1);
  const grid = { gridTemplateColumns: `repeat(${perRow(total)}, 2.75rem)` };

  if (!onPick) {
    return (
      <div role="img" aria-label={`${label}: ${done} of ${total} done`} className="grid gap-3" style={grid}>
        {coins.map((n) => <span key={n} aria-hidden="true" className={`${coin} ${n <= done ? filled : empty}`} />)}
      </div>
    );
  }

  return (
    <div role="group" aria-label={label} className="grid gap-3" style={grid}>
      {coins.map((n) =>
        n <= done ? (
          <span key={n} aria-hidden="true" className={`${coin} ${filled}`} />
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onPick(n)}
            aria-label={`I'm at ${n}`}
            className={`${coin} ${empty} hover:bg-reward/60 active:translate-y-px active:bg-reward focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus`}
          />
        ),
      )}
    </div>
  );
}
