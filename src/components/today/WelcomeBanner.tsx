export function WelcomeBanner({ message }: { message: string }) {
  return (
    <p role="status" className="mt-2 rounded-lg bg-wash p-4 text-lg font-semibold text-ink">
      {message}
    </p>
  );
}
