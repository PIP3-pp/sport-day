export type RankedRow<T> = T & { rank: number };

/**
 * Sorts by total (highest first), then by `golds` (first-place finishes) when
 * present, and assigns ranks. Teams level on both share a rank ("1, 2, 2, 4").
 */
export function rankByTotal<T extends { total: number; golds?: number }>(
  rows: T[],
): RankedRow<T>[] {
  const golds = (row: T) => row.golds ?? 0;
  const sorted = [...rows].sort((a, b) => b.total - a.total || golds(b) - golds(a));
  let rank = 0;
  let previous: T | null = null;
  return sorted.map((row, index) => {
    if (!previous || row.total !== previous.total || golds(row) !== golds(previous)) {
      rank = index + 1;
      previous = row;
    }
    return { ...row, rank };
  });
}
