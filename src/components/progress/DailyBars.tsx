import type { HistoryRow } from "@/lib/progress";

const W = 320;
const H = 150;
const BOTTOM = 26;

/** Each recent day as a honey clay bar, oldest on the left; a day that reached the number gets a fish on top. */
export function DailyBars({ rows, target, unit }: { rows: HistoryRow[]; target: number; unit: string }) {
  const days = [...rows].reverse();
  const max = Math.max(target, ...days.map((d) => d.amount), 1);
  const slot = W / Math.max(days.length, 1);
  const y = (v: number) => H - BOTTOM - (v / max) * (H - BOTTOM - 22);
  const hit = days.filter((d) => d.amount >= target).length;
  const any = days.some((d) => d.amount > 0);
  const label = `Bar chart: ${hit} of the last ${days.length} days reached ${target} ${unit}`;

  if (!any) return <p className="clay rounded-2xl bg-surface px-5 py-6 text-center font-bold text-muted">No fish yet this week, one today starts it~</p>;

  return (
    <figure className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="w-full">
        <line x1={0} x2={W} y1={y(target)} y2={y(target)} stroke="var(--color-lip)" strokeWidth={2} strokeDasharray="6 5" strokeLinecap="round" />
        {days.map((d, i) => {
          const top = y(d.amount);
          const h = Math.max(H - BOTTOM - top, d.amount > 0 ? 6 : 0);
          const x = i * slot + slot * 0.22;
          const w = slot * 0.56;
          return (
            <g key={d.date}>
              {d.amount > 0 && (
                <>
                  <rect x={x} y={H - BOTTOM - h + 4} width={w} height={h} rx={5} fill="var(--color-reward-deep)" />
                  <rect x={x} y={H - BOTTOM - h} width={w} height={h} rx={5} fill="var(--color-reward)" />
                  <rect x={x + 2} y={H - BOTTOM - h + 2} width={w - 4} height={3} rx={1.5} fill="rgba(255,255,255,.5)" />
                </>
              )}
              {d.amount >= target && <image href="/cat/fish.png" x={x - 4} y={H - BOTTOM - h - 16} width={w + 8} height={(w + 8) * 0.4} />}
              <text x={x + w / 2} y={H - 8} textAnchor="middle" fontSize={10} fontWeight={800} fill="var(--color-muted)">{d.date.slice(8)}</text>
            </g>
          );
        })}
        <line x1={0} x2={W} y1={H - BOTTOM} y2={H - BOTTOM} stroke="var(--color-hairline)" strokeWidth={2} />
      </svg>
      <figcaption className="text-sm font-bold text-muted">Dashed line is {target} a day, a fish marks a day that got there~</figcaption>
    </figure>
  );
}
