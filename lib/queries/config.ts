import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteConfig } from "@/db/schema";
import { cached, TAGS } from "./cache";

export type SiteConfig = {
  eventName: string;
  eventYear: number;
  slogan: string;
  schoolLogoUrl: string | null;
  galleryDriveUrl: string | null;
};

const FALLBACK: SiteConfig = {
  eventName: "SPORTS DAY",
  eventYear: new Date().getFullYear(),
  slogan: "",
  schoolLogoUrl: null,
  galleryDriveUrl: null,
};

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const [row] = await db.select().from(siteConfig).where(eq(siteConfig.id, 1));
  if (!row) return FALLBACK;
  return {
    eventName: row.eventName,
    eventYear: row.eventYear,
    slogan: row.slogan,
    schoolLogoUrl: row.schoolLogoUrl,
    galleryDriveUrl: row.galleryDriveUrl,
  };
}

export const getSiteConfig = cached(fetchSiteConfig, "site-config", [TAGS.config]);

/** For layouts and metadata, which must still render when the database is unreachable. */
export async function getSiteConfigSafe(): Promise<SiteConfig> {
  try {
    return await getSiteConfig();
  } catch (error) {
    console.error("Failed to load site config", error);
    return FALLBACK;
  }
}
