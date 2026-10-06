/** "30, 20,10" -> [30, 20, 10]. Anything that isn't a clean list yields []. */
export function parseRankPoints(value: string | null | undefined): number[] {
  if (!value || !RANK_POINTS_PATTERN.test(value)) return [];
  return value.split(",").map((part) => Number(part.trim()));
}

export const RANK_POINTS_PATTERN = /^\s*\d{1,4}(\s*,\s*\d{1,4}){0,7}\s*$/;
