export function WelcomeBanner({ message }: { message: string }) {
  return (
    <p role="status" className="mt-4 rounded-2xl bg-surface p-4 text-lg font-bold text-ink shadow-[0_2px_12px_rgba(61,59,51,.08)]">
      {message}
    </p>
  );
}
