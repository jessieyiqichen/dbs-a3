import { formatShortDate } from "@/lib/dates";
import type { RoadStory } from "@/lib/story";
import type { Goal } from "@/lib/types";

const W = 340;
const H = 170;
/** A gentle S from bottom-left to top-right. */
const P = [
  [22, 128],
  [130, 150],
  [210, 30],
  [318, 52],
] as const;

function point(t: number): [number, number] {
  const u = 1 - t;
  const x = u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0];
  const y = u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1];
  return [x, y];
}

const PATH = `M${P[0][0]},${P[0][1]} C${P[1][0]},${P[1][1]} ${P[2][0]},${P[2][1]} ${P[3][0]},${P[3][1]}`;

/** A by-date goal as a road Titi walks: paw prints behind her, a bowl at every quarter, a dashed ring where the
 *  steady pace would be today, and a red flag at the deadline. Titi wears her closed-eye smile here (a different
 *  frame from the avatar above), and her celebrate pose once she reaches the flag. No axes, no chart. */
export function Road({ goal, story }: { goal: Goal; story: RoadStory }) {
  const [cx, cy] = point(story.at);
  const [px, py] = point(story.pace);
  const paws = Array.from({ length: Math.floor(story.at * 14) }, (_, i) => point((i + 0.5) / 14));
  const label = `${story.done} of ${goal.target} ${goal.unit}: ${Math.round(story.at * 100)}% of the road, ${story.ahead ? "ahead of" : "behind"} the steady pace`;
  return (
    <figure className="clay rounded-3xl bg-surface px-2 pb-2 pt-3">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="w-full">
        <path d={PATH} fill="none" stroke="var(--color-wash-strong)" strokeWidth={22} strokeLinecap="round" />
        <path d={PATH} fill="none" stroke="var(--color-reward-soft)" strokeWidth={16} strokeLinecap="round" />
        {paws.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(0.55)`} fill="var(--color-reward-deep)" opacity={0.55}>
            <ellipse cx={0} cy={3} rx={4} ry={3.4} />
            <circle cx={-4.5} cy={-2} r={1.7} /><circle cx={-1.6} cy={-4.2} r={1.7} /><circle cx={1.6} cy={-4.2} r={1.7} /><circle cx={4.5} cy={-2} r={1.7} />
          </g>
        ))}
        {story.milestones.map((m) => {
          const [x, y] = point(m.at);
          return <image key={m.at} href={m.reached ? "/cat/bowl-full.png" : "/cat/bowl-empty.png"} x={x - 15} y={y - 24} width={30} height={22} opacity={m.reached ? 1 : 0.7} />;
        })}
        {/* the finish: a flag on a post with the date */}
        <line x1={P[3][0]} y1={P[3][1]} x2={P[3][0]} y2={P[3][1] - 30} stroke="var(--color-reward-deep)" strokeWidth={3} strokeLinecap="round" />
        <path d={`M${P[3][0]},${P[3][1] - 30} h18 l-5 6 l5 6 h-18 z`} fill="var(--color-flag)" />
        <text x={P[3][0] + 2} y={P[3][1] + 24} textAnchor="middle" fontSize={10} fontWeight={800} fill="var(--color-muted)">{formatShortDate(goal.deadline ?? "")}</text>
        {/* the steady pace: a small dashed marker, only when it isn't under Titi */}
        {Math.abs(story.pace - story.at) > 0.03 && (
          <g>
            <circle cx={px} cy={py} r={9} fill="none" stroke="var(--color-lip)" strokeWidth={2} strokeDasharray="3 3" />
            <text x={px} y={py + 24} textAnchor="middle" fontSize={9} fontWeight={800} fill="var(--color-lip)">pace</text>
          </g>
        )}
        <image href={story.at >= 1 ? "/cat/celebrate.png" : "/cat/happy.png"} x={cx - 26} y={cy - 50} width={52} height={52} />
      </svg>
      <figcaption className="px-3 text-center text-sm font-bold text-muted">
        {story.at >= 1 ? "Titi made it to the end of the road!" : story.ahead ? "Titi is ahead of the pace flag~" : "The pace flag is a little ahead, one today catches up~"}
      </figcaption>
    </figure>
  );
}
