/** Progress toward a number, always honey (progress belongs with the rewards; green is kept for actions). */
export function Meter({ value, max, label, className = "" }: { value: number; max: number; label: string; className?: string }) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <div role="img" aria-label={`${label}: ${value} of ${max}`} className={`h-3 w-full overflow-hidden rounded-full bg-wash-strong ${className}`}>
      <div className="h-full rounded-full bg-reward" style={{ width: `${pct}%` }} />
    </div>
  );
}
