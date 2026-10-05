export type RankedRow<T> = T & { rank: number };

/**
 * Sorts by total (highest first) and assigns ranks. Teams with the same
 * total share a rank ("1, 2, 2, 4").
 */
export function rankByTotal<T extends { total: number }>(
  rows: T[],
): RankedRow<T>[] {
  const sorted = [...rows].sort((a, b) => b.total - a.total);
  let rank = 0;
  let previous: number | null = null;
  return sorted.map((row, index) => {
    if (row.total !== previous) {
      rank = index + 1;
      previous = row.total;
    }
    return { ...row, rank };
  });
}
