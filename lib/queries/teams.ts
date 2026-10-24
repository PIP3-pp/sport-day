import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { teams } from "@/db/schema";
import { cached, TAGS } from "./cache";

export type Team = typeof teams.$inferSelect;
export type TeamRef = Pick<Team, "id" | "name" | "slug" | "color" | "logoUrl">;

export async function fetchTeams(): Promise<Team[]> {
  return db.select().from(teams).orderBy(asc(teams.id));
}

export const getTeams = cached(fetchTeams, "teams", [TAGS.teams]);

/** Looked up in the cached team list, so arbitrary slugs never add cache entries. */
export async function getTeamBySlug(slug: string): Promise<Team | null> {
  return (await getTeams()).find((team) => team.slug === slug) ?? null;
}
