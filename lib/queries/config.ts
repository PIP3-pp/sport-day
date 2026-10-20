import "server-only";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { siteConfig } from "@/db/schema";
import { parseRankPoints } from "@/lib/rank-points";
import {
  DEFAULT_VISIBILITY,
  parseVisibility,
  type SectionKey,
  type Visibility,
} from "@/lib/visibility";
import { cached, TAGS } from "./cache";

export type SiteConfig = {
  eventName: string;
  eventYear: number;
  slogan: string;
  schoolLogoUrl: string | null;
  galleryDriveUrl: string | null;
  /** Default points by finishing position, used to pre-fill the result form. */
  rankPoints: number[];
  /** Uploaded cover image or video; null means the bundled /banner.webp. */
  bannerUrl: string | null;
  visibility: Visibility;
};

const FALLBACK: SiteConfig = {
  eventName: "SPORTS DAY",
  eventYear: new Date().getFullYear(),
  slogan: "",
  schoolLogoUrl: null,
  galleryDriveUrl: null,
  rankPoints: [],
  bannerUrl: null,
  visibility: DEFAULT_VISIBILITY,
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
    rankPoints: parseRankPoints(row.rankPoints),
    bannerUrl: row.bannerUrl,
    visibility: parseVisibility(row.visibility),
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

/** For public pages: answers 404 when an admin has switched the page off. */
export async function requirePageVisible(key: SectionKey) {
  const config = await getSiteConfigSafe();
  if (!config.visibility[key]) notFound();
  return config;
}
