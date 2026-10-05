import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { sports } from "@/db/schema";
import { cached, TAGS } from "./cache";

export type Sport = typeof sports.$inferSelect;

export async function fetchSports(): Promise<Sport[]> {
  return db.select().from(sports).orderBy(asc(sports.name));
}

async function fetchActiveSports(): Promise<Sport[]> {
  return db
    .select()
    .from(sports)
    .where(eq(sports.isActive, true))
    .orderBy(asc(sports.name));
}

export const getActiveSports = cached(fetchActiveSports, "active-sports", [TAGS.sports]);
