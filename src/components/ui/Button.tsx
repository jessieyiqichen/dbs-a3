import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "choice";
type Size = "md" | "lg";

/** Buttons are Nunito, extra bold, in a pill: Fredoka is kept for display text (design system, 2026-10-18). */
const base =
  "inline-flex items-center justify-center gap-2 font-sans font-extrabold " +
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none";

/** Clay buttons: the primary one is the only saturated block on the screen and sits on a deep green lip; white
 *  clay for secondary buttons; ghost is an underlined word; a choice is a whole row you tap to answer a question.
 *  Pressing sinks a clay button onto its lip. */
const variants: Record<Variant, string> = {
  primary: "clay clay-press rounded-full [--lip:var(--color-lip)] bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "clay clay-press rounded-full bg-surface text-ink hover:bg-wash",
  ghost: "rounded-tile text-ink underline decoration-2 underline-offset-4 decoration-line hover:decoration-ink active:text-muted",
  danger: "rounded-full border-2 border-danger bg-surface text-danger hover:bg-danger-wash active:bg-danger-wash",
  choice: "clay clay-press rounded-card bg-surface text-ink hover:bg-wash",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-base",
  lg: "min-h-14 px-7 text-xl",
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function buttonClass({ variant = "primary", size = "md", className = "" }: Omit<StyleProps, "children">) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

export function Button({ variant, size, className, ...props }: StyleProps & ComponentProps<"button">) {
  return <button type="button" className={buttonClass({ variant, size, className })} {...props} />;
}

/** A link styled as a button. External links open in a new tab. */
export function ButtonLink({
  variant,
  size,
  className,
  href,
  external = false,
  children,
}: StyleProps & { href: string; external?: boolean }) {
  const cls = buttonClass({ variant, size, className });
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <span aria-hidden="true">↗</span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
