import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { cached, TAGS } from "./cache";

export type Announcement = typeof announcements.$inferSelect;

export async function fetchAnnouncements(): Promise<Announcement[]> {
  return db
    .select()
    .from(announcements)
    .orderBy(desc(announcements.publishedAt), desc(announcements.id));
}

async function fetchPublishedAnnouncements(limit: number): Promise<Announcement[]> {
  return db
    .select()
    .from(announcements)
    .where(eq(announcements.isPublished, true))
    .orderBy(desc(announcements.publishedAt), desc(announcements.id))
    .limit(limit);
}

export const getPublishedAnnouncements = cached(
  fetchPublishedAnnouncements,
  "published-announcements",
  [TAGS.announcements],
);
