import { formatShortDate } from "@/lib/dates";
import type { Point } from "@/lib/progress";

const W = 320;
const H = 160;
const PAD = { top: 12, right: 12, bottom: 24, left: 12 };

function path(points: Point[], count: number, max: number): string {
  const x = (i: number) => PAD.left + (i / Math.max(count - 1, 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => H - PAD.bottom - (v / Math.max(max, 1)) * (H - PAD.top - PAD.bottom);
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
}

/** What was done so far (solid) against the even plan to the deadline (dashed). */
export function CumulativeChart({ plan, actual, unit }: { plan: Point[]; actual: Point[]; unit: string }) {
  const max = Math.max(plan[plan.length - 1]?.value ?? 0, actual[actual.length - 1]?.value ?? 0);
  const done = actual[actual.length - 1]?.value ?? 0;
  const planned = plan[actual.length - 1]?.value ?? 0;
  const label = `Line chart: ${done} ${unit} done so far against a plan of ${planned} by today.`;

  return (
    <figure className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="w-full">
        <line x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} className="stroke-line" strokeWidth={1} />
        <path d={path(plan, plan.length, max)} fill="none" className="stroke-muted" strokeWidth={2} strokeDasharray="5 4" />
        <path d={path(actual, plan.length, max)} fill="none" className="stroke-ink" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <text x={PAD.left} y={H - 6} className="fill-muted text-[10px]">{formatShortDate(plan[0].date)}</text>
        <text x={W - PAD.right} y={H - 6} textAnchor="end" className="fill-muted text-[10px]">{formatShortDate(plan[plan.length - 1].date)}</text>
      </svg>
      <figcaption className="flex flex-wrap gap-x-4 text-sm text-muted">
        <span><span aria-hidden="true" className="mr-1 inline-block h-0.5 w-5 bg-ink align-middle" />Done</span>
        <span><span aria-hidden="true" className="mr-1 inline-block w-5 border-t-2 border-dashed border-muted align-middle" />Even plan</span>
      </figcaption>
    </figure>
  );
}
