/** Days in a row, always in the same corner of Today, like Duolingo's flame, marked with a fish treat. Only shown once there is a run. */
export function StreakChip({ days }: { days: number }) {
  return (
    <p className="-mb-2 flex items-center gap-2 self-end rounded-full bg-surface px-3 py-1 font-display text-base font-semibold text-ink shadow-[0_1px_4px_rgba(61,59,51,.14)]">
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative icon */}
      <img src="/cat/fish.png" alt="" aria-hidden="true" className="w-6" />
      {days === 1 ? "1 day" : `${days} days`}
      <span className="sr-only">in a row</span>
    </p>
  );
}
