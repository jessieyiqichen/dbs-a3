import Link from "next/link";

export function PageHeader({ title, intro, back = "/" }: { title: string; intro?: string; back?: string }) {
  return (
    <div className="flex flex-col gap-3 pt-4">
      <Link href={back} className="self-start text-sm font-semibold text-muted underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-focus">
        ← Back to Today
      </Link>
      <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
      {intro && <p className="text-lg text-muted">{intro}</p>}
    </div>
  );
}
