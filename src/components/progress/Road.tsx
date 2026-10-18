import { formatShortDate } from "@/lib/dates";
import type { RoadStory } from "@/lib/story";
import type { Goal } from "@/lib/types";

/** The painted hillside (art generated with GPT from the author's prompt), in its own pixels. */
const W = 1586;
const H = 992;

/** The middle of the painted path, traced by hand from the start near the bottom to the hilltop. */
const TRACE: [number, number][] = [
  [300, 890], [250, 830], [255, 800], [360, 762], [500, 750], [660, 735], [820, 720], [980, 700], [1090, 675],
  [1160, 630], [1150, 575], [1105, 540], [1098, 505], [1125, 470], [1210, 440], [1320, 405], [1410, 370],
  [1432, 330], [1395, 295], [1335, 276],
];

/** A smooth curve through the trace (Catmull-Rom), sampled finely so points can be found by distance along it. */
function smooth(points: [number, number][], per = 12): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(i + 2, points.length - 1)];
    for (let s = 0; s < per; s++) {
      const t = s / per, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

const CURVE = smooth(TRACE);
const LENGTHS = CURVE.reduce<number[]>((acc, p, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + Math.hypot(p[0] - CURVE[i - 1][0], p[1] - CURVE[i - 1][1]));
  return acc;
}, []);
const TOTAL = LENGTHS[LENGTHS.length - 1];

/** The spot a share `t` (0 to 1) of the way along the path. */
function point(t: number): [number, number] {
  const d = Math.min(Math.max(t, 0), 1) * TOTAL;
  const i = LENGTHS.findIndex((l) => l >= d);
  if (i <= 0) return CURVE[0];
  const k = (d - LENGTHS[i - 1]) / (LENGTHS[i] - LENGTHS[i - 1] || 1);
  return [CURVE[i - 1][0] + (CURVE[i][0] - CURVE[i - 1][0]) * k, CURVE[i - 1][1] + (CURVE[i][1] - CURVE[i - 1][1]) * k];
}

/** Things further up the hill are further away, so they are drawn smaller: full size at the bottom, about half on top. */
function depth(y: number): number {
  return 0.5 + 0.5 * ((y - 276) / (890 - 276));
}

const STEPS = 26;
const PACE_GAP = 0.08;
const LABEL_GAP = 0.07;

function Paw({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${2.2 * depth(y)})`} fill="var(--color-reward-deep)" opacity={0.55}>
      <ellipse cx={0} cy={3} rx={4} ry={3.4} />
      <circle cx={-4.5} cy={-2} r={1.7} /><circle cx={-1.6} cy={-4.2} r={1.7} /><circle cx={1.6} cy={-4.2} r={1.7} /><circle cx={4.5} cy={-2} r={1.7} />
    </g>
  );
}

/** A signpost at every quarter with its number on the board: honey once reached, cream before. The post shrinks with
 *  distance like the painting, but the board keeps one size so its number stays readable on a phone. */
function Milestone({ at, reached, count }: { at: number; reached: boolean; count: number }) {
  const [x, y] = point(at);
  const post = 90 * depth(y);
  const w = String(count).length * 28 + 44;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={3} rx={22 * depth(y)} ry={6 * depth(y)} fill="var(--color-ink)" opacity={0.18} />
      <rect x={-4.5} y={-post} width={9} height={post + 3} rx={4.5} fill="var(--color-reward-deep)" />
      <rect x={-w / 2} y={-post - 58} width={w} height={60} rx={18} fill={reached ? "var(--color-reward)" : "var(--color-surface)"} stroke={reached ? "var(--color-reward-deep)" : "var(--color-hairline)"} strokeWidth={4} />
      <rect x={-w / 2 + 9} y={-post - 51} width={w - 18} height={9} rx={4.5} fill="var(--color-surface)" opacity={reached ? 0.45 : 0} />
      <text x={0} y={-post - 14} textAnchor="middle" fontSize={44} fontWeight={800} fill={reached ? "var(--color-ink)" : "var(--color-muted)"}>{count}</text>
    </g>
  );
}

/** The finish: a red flag on the hilltop, sized for the distance, and the date on a readable tag beside it. */
function Finish({ date }: { date: string }) {
  const [x, y] = point(1);
  const s = depth(y) * 1.3;
  const w = date.length * 24 + 44;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`scale(${s})`}>
        <ellipse cx={0} cy={3} rx={26} ry={8} fill="var(--color-ink)" opacity={0.18} />
        <rect x={-5} y={-130} width={10} height={133} rx={5} fill="var(--color-reward-deep)" />
        <circle cx={0} cy={-134} r={8} fill="var(--color-reward)" />
        <path d="M5,-126 q38,-12 76,4 l-16,24 l16,24 q-38,-16 -76,-4 z" fill="var(--color-flag)" />
      </g>
      <rect x={-w - 22} y={-62} width={w} height={54} rx={27} fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth={4} />
      <text x={-w / 2 - 22} y={-23} textAnchor="middle" fontSize={38} fontWeight={800} fill="var(--color-muted)">{date}</text>
    </g>
  );
}

/** A by-date goal as Titi walking up the painted hill path: paw prints behind her, a signpost with its number at every
 *  quarter, a dashed ring where the steady pace would be today, and a red flag on the hilltop at the deadline. Things
 *  higher up the hill are drawn smaller, so they sit in the painting's distance. No axes, no chart. */
export function Road({ goal, story }: { goal: Goal; story: RoadStory }) {
  // At the finish Titi stands just before the flag, so the flag stays in view
  const [cx, cy] = point(Math.min(story.at, 0.94));
  // Titi shrinks with distance too, but never so far that she is hard to see
  const cs = Math.max(depth(cy), 0.62);
  const [px, py] = point(story.pace);
  const steps = Array.from({ length: STEPS }, (_, i) => (i + 0.5) / STEPS).filter((t) => t < story.at - 0.02);
  const showPace = Math.abs(story.pace - story.at) > PACE_GAP;
  const paceLabel = story.milestones.every((m) => Math.abs(m.at - story.pace) > LABEL_GAP) && story.pace < 0.92;
  const label = `${story.done} of ${goal.target} ${goal.unit}: ${Math.round(story.at * 100)}% of the road, ${story.ahead ? "ahead of" : "behind"} the steady pace`;
  const cat = 230 * cs;
  return (
    <figure className="flat overflow-hidden rounded-3xl bg-surface">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element -- painted art, sized by the card */}
        <img src="/cat/road.webp" alt="" aria-hidden="true" width={W} height={H} className="block h-auto w-full" />
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="absolute inset-0 h-full w-full">
          {steps.map((t) => {
            const [x, y] = point(t);
            return <Paw key={t} x={x} y={y} />;
          })}
          {story.milestones.map((m) => <Milestone key={m.at} at={m.at} reached={m.reached} count={Math.round(m.at * goal.target)} />)}
          <Finish date={formatShortDate(goal.deadline ?? "")} />
          {showPace && (
            <g transform={`translate(${px} ${py}) scale(${depth(py)})`}>
              <circle r={34} fill="var(--color-surface)" fillOpacity={0.55} stroke="var(--color-lip)" strokeWidth={7} strokeDasharray="12 9" />
              {paceLabel && <text y={80} textAnchor="middle" fontSize={34} fontWeight={800} fill="var(--color-lip)" stroke="var(--color-surface)" strokeWidth={8} paintOrder="stroke">pace</text>}
            </g>
          )}
          <ellipse cx={cx} cy={cy + 4 * cs} rx={70 * cs} ry={16 * cs} fill="var(--color-ink)" opacity={0.2} />
          <image href={story.at >= 1 ? "/cat/celebrate.png" : "/cat/happy.png"} x={cx - cat / 2} y={cy - cat + 8 * cs} width={cat} height={cat} />
        </svg>
      </div>
      <figcaption className="px-3 pb-3 pt-2 text-center text-sm font-bold text-muted">
        {/* The marker is a dashed ring, not a flag, and it is only drawn when it is clear of Titi, so the caption says so too
            (first-run check, 2026-10-18: "pace flag" sent a tester looking for a second flag) */}
        {story.at >= 1 ? "Titi made it to the end of the road!" : !showPace ? "Titi is right on pace!" : story.ahead ? "Titi is ahead of the dashed pace ring~" : "The dashed pace ring is a little ahead, one today catches up~"}
      </figcaption>
    </figure>
  );
}
