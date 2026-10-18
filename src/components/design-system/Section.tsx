import type { ReactNode } from "react";

/** One numbered part of the design system, in Assignment 2's order. */
export function Section({ n, title, note, children }: { n: number; title: string; note: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`ds-${n}`} className="border-t-2 border-hairline pt-8">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span aria-hidden="true" className="t-label inline-flex size-7 items-center justify-center rounded-full bg-ink text-surface">{n}</span>
        <h2 id={`ds-${n}`} className="t-heading text-ink">{title}</h2>
        <p className="t-label text-muted">{note}</p>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** A specimen with its name underneath. The dashed frame marks it as a sample on this page, not part of the app. */
export function Specimen({ name, children, className = "" }: { name: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`flex flex-col gap-3 ${className}`}>
      <div className="flex min-h-24 flex-wrap items-center gap-3 rounded-card border-2 border-dashed border-hairline p-4">{children}</div>
      <figcaption className="t-label text-muted">{name}</figcaption>
    </figure>
  );
}
