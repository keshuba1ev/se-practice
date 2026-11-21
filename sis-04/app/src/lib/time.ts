/** Same-day display helpers; 1440 is displayed as 24:00, not 00:00. */
export function fmt(minutes: number): string {
  const m = Math.max(0, Math.min(1440, Math.round(minutes)));
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** Strict HH:MM, including the end-of-day endpoint 24:00. */
export function parseTime(value: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return NaN;
  const h = Number(match[1]);
  const mm = Number(match[2]);
  if (mm > 59 || h > 24 || (h === 24 && mm !== 0)) return NaN;
  return h * 60 + mm;
}
