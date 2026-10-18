import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Nav, NavLinks } from "./Nav";

/** One centred column. Forms and lists stay at 36rem; Today may go wide, so on a desktop Titi's room and the goal sit
 *  side by side instead of one long narrow strip (user, 2026-10-18). */
export function AppShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={`mx-auto flex min-h-full w-full flex-col px-4 pb-24 ${wide ? "max-w-xl lg:max-w-5xl lg:px-8" : "max-w-xl"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:mt-2 focus:self-start focus:rounded-lg focus:bg-surface focus:p-2">
        Skip to content
      </a>
      <header className="flex items-center justify-between gap-3 py-4">
        <Link href="/" className="font-display text-2xl font-bold text-ink focus-visible:outline-3 focus-visible:outline-focus">
          Nudge
        </Link>
        <Suspense fallback={<NavLinks pathname={null} />}>
          <Nav />
        </Suspense>
      </header>
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
