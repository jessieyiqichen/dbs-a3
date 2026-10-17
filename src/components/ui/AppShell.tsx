import Link from "next/link";
import type { ReactNode } from "react";
import { Nav } from "./Nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-xl flex-col px-4 pb-24">
      <a href="#main" className="sr-only focus:not-sr-only focus:mt-2 focus:self-start focus:rounded-lg focus:bg-surface focus:p-2">
        Skip to content
      </a>
      <header className="flex items-center justify-between gap-3 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-ink focus-visible:outline-3 focus-visible:outline-focus">
          Nudge
        </Link>
        <Nav />
      </header>
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
