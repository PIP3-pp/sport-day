import "server-only";
import { unstable_cache } from "next/cache";

export const TAGS = {
  teams: "teams",
  sports: "sports",
  // Matches, results and score points change together, so they share a tag.
  matches: "matches",
  highlights: "highlights",
  announcements: "announcements",
  practice: "practice",
  config: "config",
} as const;

export type CacheTag = (typeof TAGS)[keyof typeof TAGS];

/**
 * Caches a public read query. Admin mutations invalidate by tag, so visitors
 * hit the database only on the first request after a change. The 5-minute
 * revalidate is just a safety net.
 */
export function cached<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  key: string,
  tags: CacheTag[],
) {
  return unstable_cache(fn, [key], { tags, revalidate: 300 });
}
