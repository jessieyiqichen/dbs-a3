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
  const label = `Line chart: ${done} ${unit} done so far against a plan of ${planned} by today`;

  return (
    <figure className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="w-full">
        <line x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} stroke="var(--color-hairline)" strokeWidth={2} />
        <path d={path(plan, plan.length, max)} fill="none" stroke="var(--color-lip)" strokeWidth={2} strokeDasharray="6 5" strokeLinecap="round" />
        <path d={`${path(actual, plan.length, max)} V${H - PAD.bottom} H${PAD.left} Z`} fill="var(--color-reward)" opacity={0.25} />
        <path d={path(actual, plan.length, max)} fill="none" stroke="var(--color-reward-deep)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <text x={PAD.left} y={H - 6} fontSize={10} fontWeight={800} fill="var(--color-muted)">{formatShortDate(plan[0].date)}</text>
        <text x={W - PAD.right} y={H - 6} textAnchor="end" fontSize={10} fontWeight={800} fill="var(--color-muted)">{formatShortDate(plan[plan.length - 1].date)}</text>
      </svg>
      <figcaption className="flex flex-wrap gap-x-4 text-sm font-bold text-muted">
        <span><span aria-hidden="true" className="mr-1 inline-block h-1 w-5 rounded bg-reward-deep align-middle" />Done so far</span>
        <span><span aria-hidden="true" className="mr-1 inline-block w-5 border-t-2 border-dashed border-lip align-middle" />Steady pace</span>
      </figcaption>
    </figure>
  );
}
