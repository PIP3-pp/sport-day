import "server-only";
import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { results, scorePoints, teams } from "@/db/schema";
import { rankByTotal, type RankedRow } from "@/lib/standings";
import { cached, TAGS } from "./cache";
import type { TeamRef } from "./teams";

export type Standing = RankedRow<TeamRef & { slogan: string | null; total: number; golds: number }>;

/**
 * Totals are always derived: SUM(score_points.points) GROUP BY team. Ties are
 * broken by golds, the number of first-place finishes (a drawn match gives
 * both teams a first place).
 */
export async function fetchStandings(): Promise<Standing[]> {
  const rows = await db
    .select({
      id: teams.id,
      name: teams.name,
      slug: teams.slug,
      color: teams.color,
      logoUrl: teams.logoUrl,
      slogan: teams.slogan,
      total: sql<number>`coalesce(sum(${scorePoints.points}), 0)::int`,
      golds: sql<number>`(select count(*)::int from ${results} where ${results.teamId} = ${teams.id} and ${results.position} = 1)`,
    })
    .from(teams)
    .leftJoin(scorePoints, eq(scorePoints.teamId, teams.id))
    .groupBy(teams.id)
    .orderBy(asc(teams.id));
  return rankByTotal(rows);
}

export const getStandings = cached(fetchStandings, "standings", [
  TAGS.matches,
  TAGS.teams,
]);
