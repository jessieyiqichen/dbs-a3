export function WelcomeBanner({ message }: { message: string }) {
  return (
    <p
      role="status"
      className="relative mt-4 self-center rounded-2xl bg-surface px-4 py-3 text-center font-display text-lg font-semibold text-ink shadow-[0_2px_12px_rgba(61,59,51,.10)] after:absolute after:-bottom-2 after:left-1/2 after:size-4 after:-translate-x-1/2 after:rotate-45 after:bg-surface"
    >
      {message}
    </p>
  );
}
