/** "11 connections", "1 connection". Units are stored in the plural. */
export function formatCount(n: number, unit: string): string {
  const word = n === 1 && unit.length > 1 && unit.endsWith("s") ? unit.slice(0, -1) : unit;
  return `${n} ${word}`;
}
