import Link from "next/link";
import type { ReactNode } from "react";

/** A quiet link to another page: underlined words and an arrow, no box (a box would say "button"). */
export function ArrowLink({ href, children, label, className = "" }: { href: string; children: ReactNode; label?: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`t-body inline-flex min-h-11 items-center gap-2 self-start font-extrabold text-muted underline decoration-2 underline-offset-4 hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus ${className}`}
    >
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}
