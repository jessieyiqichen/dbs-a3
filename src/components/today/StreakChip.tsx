/** Days in a row, always in the same corner of Today, like Duolingo's flame. Only shown once there is a run. */
export function StreakChip({ days }: { days: number }) {
  return (
    <p className="-mb-2 flex items-center gap-2 self-end rounded-full bg-surface px-3 py-1 font-display text-base font-semibold text-ink shadow-[0_1px_3px_rgba(29,43,83,.16)]">
      <span aria-hidden="true" className="size-4 rounded-full border-2 border-ink bg-reward" />
      {days === 1 ? "1 day" : `${days} days`}
      <span className="sr-only">in a row</span>
    </p>
  );
}
