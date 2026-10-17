import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-xl flex-col px-4 pb-16">
      <header className="flex items-center justify-between py-5">
        <Link href="/" className="text-lg font-bold tracking-tight text-ink focus-visible:outline-3 focus-visible:outline-focus">
          Nudge
        </Link>
      </header>
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
