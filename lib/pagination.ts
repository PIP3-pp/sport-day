/** Public result lists grow by this many matches per "show more" step. */
export const RESULTS_PAGE_SIZE = 30;
/** Upper bound on steps; it also bounds the number of cached query variants. */
export const RESULTS_MAX_STEPS = 20;

/** Reads a `?show=` value as a whole number of steps between 1 and RESULTS_MAX_STEPS. */
export function parseSteps(value: string | undefined): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return 1;
  return Math.min(n, RESULTS_MAX_STEPS);
}

/** Reads a `?page=` value as a page number of at least 1. */
export function parsePage(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? Math.min(n, 10_000) : 1;
}
