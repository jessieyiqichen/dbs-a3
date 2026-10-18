import type { ReactNode } from "react";

/** Titi speaking: the only read-only shape with a backing, because the tail says "speech". The tail points down
 *  and left, towards Titi. */
export function Bubble({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flat rounded-card rounded-bl-md bg-surface px-4 py-3 ${className}`}>{children}</div>;
}
