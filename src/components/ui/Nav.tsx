"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Today" },
  { href: "/reminders", label: "Reminders" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main">
      <ul className="flex gap-1">
        {LINKS.map(({ href, label }) => {
          const current = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={
                  "inline-flex min-h-11 items-center rounded-lg px-3 font-semibold focus-visible:outline-3 focus-visible:outline-focus " +
                  (current ? "bg-wash text-ink underline decoration-2 underline-offset-4" : "text-muted hover:text-ink")
                }
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
