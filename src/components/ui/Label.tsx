import type { ReactNode } from "react";

/** The Label role: one small muted line that says what the thing below belongs to, e.g. which goal a sentence is
 *  about. It always sits directly above what it names, never on its own (design system, 2026-10-18). */
export function Label({ children, as: Tag = "p", className = "" }: { children: ReactNode; as?: "p" | "span"; className?: string }) {
  return <Tag className={`t-label text-muted ${className}`}>{children}</Tag>;
}
