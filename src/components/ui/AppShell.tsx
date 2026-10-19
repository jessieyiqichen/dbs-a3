import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Nav, NavLinks } from "./Nav";

/** One centred column on a phone (36rem). From 1024px every page shares one desktop frame (72rem) laid out on a 12-column
 *  grid, so the logo and the navigation never move between pages (reviewer's plan A, user 2026-10-19; before, Goals and
 *  Reminders were 544px wide and the header jumped 272px). The width names are kept for the pages that pass them. */
const FRAME = "max-w-xl lg:max-w-6xl lg:px-8";
const WIDTHS = { narrow: FRAME, medium: FRAME, wide: FRAME };

export function AppShell({ children, width = "narrow" }: { children: ReactNode; width?: keyof typeof WIDTHS }) {
  return (
    <div className={`mx-auto flex min-h-full w-full flex-col px-4 pb-24 lg:pb-12 ${WIDTHS[width]}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:mt-2 focus:self-start focus:rounded-lg focus:bg-surface focus:p-2">
        Skip to content
      </a>
      <header className="flex items-center justify-between gap-3 py-4 lg:py-6">
        <Link href="/" className="inline-flex min-h-11 items-center font-display text-2xl font-bold text-ink focus-visible:outline-3 focus-visible:outline-focus lg:text-4xl">
          Nudge
        </Link>
        <Suspense fallback={<NavLinks pathname={null} />}>
          <Nav />
        </Suspense>
      </header>
      {/* On a desktop a page shorter than the screen sits in the middle of the space under the header, instead of at the
          top with the lower half empty (user, 2026-10-19); a longer page starts at the top as usual */}
      <main id="main" className="flex flex-1 flex-col lg:justify-center lg:text-lg">
        {children}
      </main>
    </div>
  );
}
