import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { highlights } from "@/db/schema";
import { cached, TAGS } from "./cache";

export type Highlight = typeof highlights.$inferSelect;

export async function fetchHighlights(): Promise<Highlight[]> {
  return db.select().from(highlights).orderBy(desc(highlights.date), desc(highlights.id));
}

async function fetchActiveHighlight(date: string): Promise<Highlight | null> {
  const [row] = await db
    .select()
    .from(highlights)
    .where(and(eq(highlights.date, date), eq(highlights.isActive, true)));
  return row ?? null;
}

export const getActiveHighlight = cached(fetchActiveHighlight, "active-highlight", [
  TAGS.highlights,
]);
