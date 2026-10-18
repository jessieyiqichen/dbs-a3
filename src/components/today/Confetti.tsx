/** A handful of confetti that falls once behind the heading. Hidden for people who ask for less motion. */
export function Confetti() {
  const colours = ["var(--color-lip)", "var(--color-reward)", "var(--color-heart)", "var(--color-sun)"];
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
