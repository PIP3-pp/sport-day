import { asc, eq } from "drizzle-orm";
import { matches, results, scorePoints, sports, teams, type MatchStatus } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { db } from "./client";

export const EMPTY: ActionState = { ok: false, message: "" };

export function form(fields: Record<string, string | number>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, String(value));
  return data;
}

/** Four teams (ids 1–4, in order) and one sport. */
export async function seedTeams() {
  await db.insert(teams).values(
    ["red", "blue", "green", "yellow"].map((slug) => ({ name: slug, slug, color: "#000000" })),
  );
  const [sport] = await db.insert(sports).values({ name: "football" }).returning();
  return { teamIds: [1, 2, 3, 4], sportId: sport.id };
}

export async function createMatch(
  sportId: number,
  participants:
    | { format: "versus"; teamAId: number; teamBId: number }
    | { format: "all_teams" },
  status: MatchStatus = "scheduled",
) {
  const [match] = await db
    .insert(matches)
    .values({
      sportId,
      date: "2026-10-05",
      startTime: "09:00",
      round: "final",
      status,
      ...participants,
    })
    .returning({ id: matches.id });
  return match.id;
}

export async function matchStatus(matchId: number) {
  const [match] = await db
    .select({ status: matches.status })
    .from(matches)
    .where(eq(matches.id, matchId));
  return match.status;
}

export function resultRows(matchId: number) {
  return db
    .select({ teamId: results.teamId, score: results.score, position: results.position })
    .from(results)
    .where(eq(results.matchId, matchId))
    .orderBy(asc(results.teamId));
}

export function pointRows(matchId: number) {
  return db
    .select({ teamId: scorePoints.teamId, points: scorePoints.points })
    .from(scorePoints)
    .where(eq(scorePoints.matchId, matchId))
    .orderBy(asc(scorePoints.teamId));
}
