import "server-only";
import { and, asc, desc, eq, inArray, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { matches, results, type MatchFormat, type MatchStatus } from "@/db/schema";
import { cached, TAGS } from "./cache";
import type { TeamRef } from "./teams";

export type MatchLine = {
  team: TeamRef;
  score: number | null;
  position: number | null;
  points: number | null;
};

export type MatchView = {
  id: number;
  date: string;
  startTime: string;
  round: string;
  format: MatchFormat;
  status: MatchStatus;
  sport: { id: number; name: string; icon: string | null };
  teamA: TeamRef | null;
  teamB: TeamRef | null;
  /** Result rows, best position first. Empty until a result is entered. */
  lines: MatchLine[];
};

const toTeamRef = (team: TeamRef): TeamRef => ({
  id: team.id,
  name: team.name,
  slug: team.slug,
  color: team.color,
  logoUrl: team.logoUrl,
});

type Order = "schedule" | "latest";

async function fetchMatches(
  where: SQL | undefined,
  order: Order,
  limit?: number,
): Promise<MatchView[]> {
  const rows = await db.query.matches.findMany({
    where,
    orderBy:
      order === "schedule"
        ? [asc(matches.date), asc(matches.startTime), asc(matches.id)]
        : [desc(matches.date), desc(matches.startTime), desc(matches.id)],
    limit,
    with: {
      sport: true,
      teamA: true,
      teamB: true,
      results: { with: { team: true } },
      scorePoints: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    date: row.date,
    startTime: row.startTime,
    round: row.round,
    format: row.format,
    status: row.status,
    sport: { id: row.sport.id, name: row.sport.name, icon: row.sport.icon },
    teamA: row.teamA ? toTeamRef(row.teamA) : null,
    teamB: row.teamB ? toTeamRef(row.teamB) : null,
    lines: row.results
      .map((result) => ({
        team: toTeamRef(result.team),
        score: result.score,
        position: result.position,
        points:
          row.scorePoints.find((p) => p.teamId === result.teamId)?.points ?? null,
      }))
      .sort((a, b) => (a.position ?? 99) - (b.position ?? 99) || a.team.id - b.team.id),
  }));
}

// --- Admin (always fresh) ---

export function fetchAllMatches() {
  return fetchMatches(undefined, "latest");
}

export async function fetchMatch(id: number): Promise<MatchView | null> {
  const [match] = await fetchMatches(eq(matches.id, id), "schedule", 1);
  return match ?? null;
}

// --- Public (cached) ---

export const getMatchesByDate = cached(
  (date: string) => fetchMatches(eq(matches.date, date), "schedule"),
  "matches-by-date",
  [TAGS.matches, TAGS.sports, TAGS.teams],
);

export const getMatchDates = cached(
  async () => {
    const rows = await db
      .selectDistinct({ date: matches.date })
      .from(matches)
      .orderBy(asc(matches.date));
    return rows.map((row) => row.date);
  },
  "match-dates",
  [TAGS.matches],
);

export const getCompletedMatches = cached(
  (sportId?: number) =>
    fetchMatches(
      and(
        eq(matches.status, "completed"),
        sportId ? eq(matches.sportId, sportId) : undefined,
      ),
      "latest",
    ),
  "completed-matches",
  [TAGS.matches, TAGS.sports, TAGS.teams],
);

export const getLatestResults = cached(
  (limit: number) => fetchMatches(eq(matches.status, "completed"), "latest", limit),
  "latest-results",
  [TAGS.matches, TAGS.sports, TAGS.teams],
);

export const getTeamResults = cached(
  (teamId: number) =>
    fetchMatches(
      and(
        eq(matches.status, "completed"),
        inArray(
          matches.id,
          db
            .select({ id: results.matchId })
            .from(results)
            .where(eq(results.teamId, teamId)),
        ),
      ),
      "latest",
    ),
  "team-results",
  [TAGS.matches, TAGS.sports, TAGS.teams],
);

export const getMatch = cached(fetchMatch, "match-by-id", [
  TAGS.matches,
  TAGS.sports,
  TAGS.teams,
]);
