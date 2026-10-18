import { formatShortDate } from "@/lib/dates";
import type { RoadStory } from "@/lib/story";
import type { Goal } from "@/lib/types";

const W = 340;
const H = 196;
/** A gentle S from bottom-left to top-right. */
const P = [
  [22, 134],
  [130, 158],
  [210, 36],
  [318, 58],
] as const;
/** Steps along the road: paw prints on the walked part, stepping stones on the rest. */
const STEPS = 14;
/** The pace label steps aside when it would land on a milestone number. */
const LABEL_GAP = 0.06;

function point(t: number): [number, number] {
  const u = 1 - t;
  const x = u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0];
  const y = u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1];
  return [x, y];
}

const PATH = `M${P[0][0]},${P[0][1]} C${P[1][0]},${P[1][1]} ${P[2][0]},${P[2][1]} ${P[3][0]},${P[3][1]}`;
/** The ground: everything under the road down to the bottom of the picture. */
const LAND = `${PATH} L${W},${H} L0,${H} Z`;

/** Tufts of grass and butter flowers on the hillside, kept off the road. */
const TUFTS: [number, number][] = [[60, 170], [150, 182], [238, 120], [300, 150], [268, 176]];
const FLOWERS: [number, number][] = [[98, 180], [196, 150], [322, 118]];

function Scenery() {
  return (
    <g aria-hidden="true">
      <circle cx={62} cy={48} r={20} fill="var(--color-sun)" />
      {/* a far hill behind the road, the near slope under it */}
      <ellipse cx={120} cy={158} rx={150} ry={64} fill="var(--color-primary)" opacity={0.09} />
      <path d={LAND} fill="var(--color-primary)" opacity={0.16} />
      {TUFTS.map(([x, y]) => (
        <path key={`${x},${y}`} d={`M${x - 5},${y} q2,-7 4,-1 M${x},${y} q0,-9 2,-2 M${x + 5},${y} q-1,-7 -3,-1`} fill="none" stroke="var(--color-lip)" strokeWidth={1.6} strokeLinecap="round" opacity={0.55} />
      ))}
      {FLOWERS.map(([x, y]) => (
        <g key={`${x},${y}`} fill="var(--color-reward)" opacity={0.85}>
          <circle cx={x - 2.6} cy={y} r={1.8} /><circle cx={x + 2.6} cy={y} r={1.8} /><circle cx={x} cy={y - 2.6} r={1.8} /><circle cx={x} cy={y + 2.6} r={1.8} />
          <circle cx={x} cy={y} r={1.6} fill="var(--color-surface)" />
        </g>
      ))}
    </g>
  );
}

/** The road as clay: a deeper lip under it, the butter band on top, a soft highlight along its upper edge. */
function RoadBand() {
  return (
    <g aria-hidden="true">
      <path d={PATH} transform="translate(0 5)" fill="none" stroke="var(--color-reward-deep)" opacity={0.28} strokeWidth={26} strokeLinecap="round" />
      <path d={PATH} fill="none" stroke="var(--color-wash-strong)" strokeWidth={26} strokeLinecap="round" />
      <path d={PATH} fill="none" stroke="var(--color-reward-soft)" strokeWidth={18} strokeLinecap="round" />
      <path d={PATH} transform="translate(0 -5)" fill="none" stroke="var(--color-surface)" opacity={0.6} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

function Paw({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(0.55)`} fill="var(--color-reward-deep)" opacity={0.55}>
      <ellipse cx={0} cy={3} rx={4} ry={3.4} />
      <circle cx={-4.5} cy={-2} r={1.7} /><circle cx={-1.6} cy={-4.2} r={1.7} /><circle cx={1.6} cy={-4.2} r={1.7} /><circle cx={4.5} cy={-2} r={1.7} />
    </g>
  );
}

/** A bowl on the road at every quarter, with the number it stands for underneath. */
function Milestone({ at, reached, count }: { at: number; reached: boolean; count: number }) {
  const [x, y] = point(at);
  return (
    <g>
      <ellipse cx={x} cy={y + 1} rx={13} ry={3.5} fill="var(--color-ink)" opacity={0.1} />
      <image href={reached ? "/cat/bowl-full.png" : "/cat/bowl-empty.png"} x={x - 15} y={y - 24} width={30} height={22} opacity={reached ? 1 : 0.75} />
      <text x={x} y={y + 25} textAnchor="middle" fontSize={10} fontWeight={800} fill="var(--color-muted)">{count}</text>
    </g>
  );
}

/** The finish: a red flag on a post, the date beneath it. */
function Finish({ date }: { date: string }) {
  const [x, y] = P[3];
  return (
    <g>
      <ellipse cx={x} cy={y + 1} rx={9} ry={3} fill="var(--color-ink)" opacity={0.1} />
      <line x1={x} y1={y} x2={x} y2={y - 32} stroke="var(--color-reward-deep)" strokeWidth={3} strokeLinecap="round" />
      <path d={`M${x},${y - 32} h19 l-5 6 l5 6 h-19 z`} fill="var(--color-flag)" />
      <text x={x + 2} y={y + 25} textAnchor="middle" fontSize={10} fontWeight={800} fill="var(--color-muted)">{date}</text>
    </g>
  );
}

/** A by-date goal as a road Titi walks up a hillside: her mat at the start, paw prints behind her, stepping stones
 *  ahead, a bowl at every quarter, a dashed ring where the steady pace would be today, and a red flag at the deadline.
 *  Titi wears her closed-eye smile here (a different frame from the avatar above), and her celebrate pose once she
 *  reaches the flag. No axes, no chart. */
export function Road({ goal, story }: { goal: Goal; story: RoadStory }) {
  const [cx, cy] = point(story.at);
  const [px, py] = point(story.pace);
  const steps = Array.from({ length: STEPS }, (_, i) => (i + 0.5) / STEPS);
  const showPace = Math.abs(story.pace - story.at) > 0.03;
  const paceLabel = story.milestones.every((m) => Math.abs(m.at - story.pace) > LABEL_GAP);
  const label = `${story.done} of ${goal.target} ${goal.unit}: ${Math.round(story.at * 100)}% of the road, ${story.ahead ? "ahead of" : "behind"} the steady pace`;
  return (
    <figure className="clay overflow-hidden rounded-3xl bg-surface">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="w-full">
        <Scenery />
        <RoadBand />
        {/* Titi's mat stays at the start, so the road begins at home */}
        <rect x={P[0][0] - 16} y={P[0][1] - 5} width={32} height={10} rx={5} fill="var(--color-sun)" />
        {steps.map((t) => {
          const [x, y] = point(t);
          return t < story.at ? <Paw key={t} x={x} y={y} /> : <ellipse key={t} cx={x} cy={y} rx={4} ry={2.6} fill="var(--color-wash-strong)" />;
        })}
        {story.milestones.map((m) => <Milestone key={m.at} at={m.at} reached={m.reached} count={Math.round(m.at * goal.target)} />)}
        <Finish date={formatShortDate(goal.deadline ?? "")} />
        {showPace && (
          <g>
            <circle cx={px} cy={py} r={9} fill="none" stroke="var(--color-lip)" strokeWidth={2} strokeDasharray="3 3" />
            {paceLabel && <text x={px} y={py + 25} textAnchor="middle" fontSize={9} fontWeight={800} fill="var(--color-lip)">pace</text>}
          </g>
        )}
        <ellipse cx={cx} cy={cy + 2} rx={16} ry={4} fill="var(--color-ink)" opacity={0.12} />
        <image href={story.at >= 1 ? "/cat/celebrate.png" : "/cat/happy.png"} x={cx - 26} y={cy - 50} width={52} height={52} />
      </svg>
      <figcaption className="px-3 pb-3 pt-1 text-center text-sm font-bold text-muted">
        {story.at >= 1 ? "Titi made it to the end of the road!" : story.ahead ? "Titi is ahead of the pace flag~" : "The pace flag is a little ahead, one today catches up~"}
      </figcaption>
    </figure>
  );
}
