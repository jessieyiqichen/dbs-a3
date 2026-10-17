export type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

export const MAX_LOG = 1000;

/** A count typed by the person, e.g. "8" in "Log several". */
export function parseCount(text: string): Parsed<number> {
  const trimmed = text.trim();
  if (!/^\d+$/.test(trimmed) || Number(trimmed) < 1) return { ok: false, error: "Enter a whole number, like 5." };
  const value = Number(trimmed);
  if (value > MAX_LOG) return { ok: false, error: "That's a lot! Enter a number up to 1,000." };
  return { ok: true, value };
}
