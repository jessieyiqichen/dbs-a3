/** The done screen's picture: a gold coin with a tick and a few sparkles. Stands in until the character art is in. */
export function Celebration() {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className="pop-in size-32 animate-[pop-in_.6s_ease-out]">
      <path d="M18 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3zM100 18l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM104 86l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="var(--color-reward)" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="60" cy="62" r="38" fill="var(--color-reward)" stroke="var(--color-ink)" strokeWidth="5" />
      <circle cx="60" cy="62" r="28" fill="none" stroke="var(--color-reward-deep)" strokeWidth="4" />
      <path d="M45 63l10 10 21-22" fill="none" stroke="var(--color-ink)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A handful of confetti that falls once behind the heading. Hidden for people who ask for less motion. */
export function Confetti() {
  const colours = ["var(--color-primary)", "var(--color-reward)", "var(--color-ink)", "#ffffff"];
  return (
    <div aria-hidden="true" className="confetti pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden">
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          className="absolute h-4 w-2.5 rounded-sm"
          style={{
            left: `${(i * 37) % 96}%`,
            top: `${(i * 23) % 40}px`,
            background: colours[i % colours.length],
            animation: `confetti-fall ${1.6 + (i % 5) * 0.25}s ease-in ${(i % 4) * 0.12}s both`,
            ["--fall" as string]: `${140 + (i % 6) * 18}px`,
            ["--spin" as string]: `${(i % 2 ? 1 : -1) * (160 + i * 12)}deg`,
          }}
        />
      ))}
    </div>
  );
}
