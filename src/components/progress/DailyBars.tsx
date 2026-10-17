import type { HistoryRow } from "@/lib/progress";

const W = 320;
const H = 140;
const BOTTOM = 20;

/** Each recent day as a bar, oldest on the left, with the daily target as a dashed line. */
export function DailyBars({ rows, target, unit }: { rows: HistoryRow[]; target: number; unit: string }) {
  const days = [...rows].reverse();
  const max = Math.max(target, ...days.map((d) => d.amount), 1);
  const slot = W / Math.max(days.length, 1);
  const y = (v: number) => H - BOTTOM - (v / max) * (H - BOTTOM - 8);
  const hit = days.filter((d) => d.amount >= target).length;
  const label = `Bar chart: ${hit} of the last ${days.length} days reached ${target} ${unit}.`;

  return (
    <figure className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="w-full">
        {days.map((d, i) => (
          <rect
            key={d.date}
            x={i * slot + slot * 0.2}
            width={slot * 0.6}
            y={y(d.amount)}
            height={H - BOTTOM - y(d.amount)}
            rx={2}
            className={d.amount >= target ? "fill-ink" : "fill-muted"}
          />
        ))}
        <line x1={0} x2={W} y1={y(target)} y2={y(target)} className="stroke-ink" strokeWidth={1.5} strokeDasharray="5 4" />
        <line x1={0} x2={W} y1={H - BOTTOM} y2={H - BOTTOM} className="stroke-line" strokeWidth={1} />
      </svg>
      <figcaption className="text-sm text-muted">Dashed line: {target} a day. Darker bars reached it.</figcaption>
    </figure>
  );
}
