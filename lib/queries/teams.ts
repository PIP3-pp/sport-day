import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { teams } from "@/db/schema";
import { cached, TAGS } from "./cache";

export type Team = typeof teams.$inferSelect;
export type TeamRef = Pick<Team, "id" | "name" | "slug" | "color" | "logoUrl">;

export async function fetchTeams(): Promise<Team[]> {
  return db.select().from(teams).orderBy(asc(teams.id));
}

async function fetchTeamBySlug(slug: string): Promise<Team | null> {
  const [row] = await db.select().from(teams).where(eq(teams.slug, slug));
  return row ?? null;
}

export const getTeams = cached(fetchTeams, "teams", [TAGS.teams]);
export const getTeamBySlug = cached(fetchTeamBySlug, "team-by-slug", [TAGS.teams]);
