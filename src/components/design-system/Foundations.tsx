import { ratio } from "@/lib/contrast";
import { COLOR_ROLES, DECOR } from "@/lib/tokens";
import { Section } from "./Section";

export function ColorRoles() {
  return (
    <Section n={1} title="Color roles" note="Each colour has one job; contrast checked against WCAG AA">
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
        {COLOR_ROLES.map((r) => (
          <div key={r.role} className="flex flex-col gap-1">
            <div className="h-16 rounded-tile border-2 border-hairline" style={{ background: r.hex }} />
            <p className="t-body mt-1 font-extrabold text-ink">{r.role}</p>
            <p className="t-label text-muted">{r.hex} · {r.use}</p>
            {r.checks.map(([what, fg, bg]) => (
              <p key={what} className="t-label text-ink">
                {ratio(fg, bg)} <span className="text-muted">{what}</span>
              </p>
            ))}
          </div>
        ))}
      </div>
      <p className="t-label mt-6 text-muted">
        Painted only, never text or an action: {DECOR.map((d) => `${d.name} ${d.hex} (${d.use})`).join(", ")}
      </p>
    </Section>
  );
}

const TYPE = [
  { role: "Display", spec: "Fredoka 700 · 32 / 37", cls: "t-display text-ink", sample: "Send 5 connection requests", use: "The one sentence that says what to do now; Done for today!" },
  { role: "Heading", spec: "Fredoka 600 · 20 / 26", cls: "t-heading text-ink", sample: "Your goals", use: "Page and section titles" },
  { role: "Body", spec: "Nunito 600 · 16 / 24 (800 for buttons and field labels)", cls: "t-body text-ink", sample: "Go do one, then come back and tell Titi how many", use: "Sentences, buttons, list text" },
  { role: "Label", spec: "Nunito 800 · 13 / 18, muted", cls: "t-label text-muted", sample: "Connection requests", use: "What the thing below belongs to; hints; captions" },
  { role: "Number", spec: "Fredoka 600 · 48 / 48, tabular", cls: "t-number text-reward-deep", sample: "38", use: "Counts on the done screen and Progress" },
];

export function TypeRoles() {
  return (
    <Section n={2} title="Type roles" note="Four roles and a number style, five sizes in all; Fredoka only for Display, Heading and Number">
      <div className="flex flex-col gap-5">
        {TYPE.map((t) => (
          <div key={t.role} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-6">
            <div>
              <p className="t-body font-extrabold text-ink">{t.role}</p>
              <p className="t-label text-muted">{t.spec}</p>
            </div>
            <div>
              <p className={t.cls}>{t.sample}</p>
              <p className="t-label mt-1 text-muted">{t.use}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

const SPACE = [4, 8, 12, 16, 24, 32, 48];
const RADII = [
  { name: "tile · 12", cls: "rounded-tile", use: "Inputs, fish tiles" },
  { name: "card · 24", cls: "rounded-card", use: "Rows, cards, pictures, bubbles" },
  { name: "full", cls: "rounded-full", use: "Buttons, goal pills" },
];

export function SpacingShape() {
  return (
    <Section n={3} title="Spacing and shape" note="A 4px scale, three corners, and depth only where you can press">
      <div className="grid gap-8 lg:grid-cols-3">
        <div>
          <div className="flex items-end gap-3">
            {SPACE.map((s) => (
              <div key={s} className="flex flex-col items-center gap-1">
                <div className="w-5 rounded-sm bg-reward" style={{ height: s }} />
                <span className="t-label text-muted">{s}</span>
              </div>
            ))}
          </div>
          <p className="t-label mt-3 text-muted">Spacing scale in px</p>
        </div>
        <div className="flex gap-4">
          {RADII.map((r) => (
            <div key={r.name} className="flex flex-col gap-1">
              <div className={`h-14 w-20 border-2 border-line bg-surface ${r.cls}`} />
              <span className="t-label text-ink">{r.name}</span>
              <span className="t-label text-muted">{r.use}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-1">
            <div className="clay h-14 w-24 rounded-full bg-surface" />
            <span className="t-label text-ink">Clay</span>
            <span className="t-label text-muted">A lip: you can press it</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flat h-14 w-24 rounded-card bg-surface" />
            <span className="t-label text-ink">Flat</span>
            <span className="t-label text-muted">Titi&apos;s bubble only</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-14 w-24 rounded-card border-2 border-dashed border-hairline" />
            <span className="t-label text-ink">None</span>
            <span className="t-label text-muted">Everything you only read</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
