import type { Metadata } from "next";
import Link from "next/link";
import { Components } from "@/components/design-system/Library";
import { ColorRoles, SpacingShape, TypeRoles } from "@/components/design-system/Foundations";
import { ControlStates, UIStates } from "@/components/design-system/States";

export const metadata: Metadata = { title: "Design system · Nudge" };

/** Nudge's design system, laid out like Assignment 2's: colour roles, type roles, spacing and shape, components,
 *  control states and UI states. Not in the navigation; the README links here. */
export default function DesignSystemPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 pb-24 pt-6 lg:px-8">
      <header className="flex flex-col gap-2">
        <Link href="/" className="t-label self-start text-muted underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-focus">← Nudge</Link>
        <h1 className="t-display text-ink">Nudge · Design system</h1>
        <p className="t-body max-w-2xl text-muted">
          Cozy Cat, clay edition: a warm page, Titi painted in, and chunky clay only on what you can press. Built on Assignment 2&apos;s six parts, with Nudge&apos;s own words
        </p>
      </header>
      <ColorRoles />
      <TypeRoles />
      <SpacingShape />
      <Components />
      <ControlStates />
      <UIStates />
    </div>
  );
}
