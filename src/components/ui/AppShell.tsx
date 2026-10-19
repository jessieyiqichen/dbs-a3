import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Nav, NavLinks } from "./Nav";

/** One centred column. Forms and lists stay at 36rem. From 1024px Today, the session and Progress share one wide desktop
 *  frame (72rem), so the header sits in the same place on all three and the pages are laid out for a desktop instead of
 *  a stretched phone (user, 2026-10-18). `medium` is kept as a name for Progress and matches `wide`. */
const DESKTOP = "max-w-xl lg:max-w-6xl lg:px-8";
const WIDTHS = { narrow: "max-w-xl", medium: DESKTOP, wide: DESKTOP };

export function AppShell({ children, width = "narrow" }: { children: ReactNode; width?: keyof typeof WIDTHS }) {
  return (
    <div className={`mx-auto flex min-h-full w-full flex-col px-4 pb-24 ${WIDTHS[width]}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:mt-2 focus:self-start focus:rounded-lg focus:bg-surface focus:p-2">
        Skip to content
      </a>
      <header className="flex items-center justify-between gap-3 py-4">
        <Link href="/" className="inline-flex min-h-11 items-center font-display text-2xl font-bold text-ink focus-visible:outline-3 focus-visible:outline-focus">
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
