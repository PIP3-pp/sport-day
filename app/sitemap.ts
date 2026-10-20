import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { getSiteConfigSafe } from "@/lib/queries/config";
import { getTeams } from "@/lib/queries/teams";
import { hiddenPages } from "@/lib/visibility";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const hidden = hiddenPages((await getSiteConfigSafe()).visibility);
  const pages = ["", "/practice", "/schedule", "/results", "/teams", "/gallery"]
    .filter((path) => !hidden.includes(path))
    .map((path) => ({ url: `${base}${path}` }));
  if (hidden.includes("/teams")) return pages;
  try {
    const teams = await getTeams();
    return [...pages, ...teams.map((team) => ({ url: `${base}/teams/${team.slug}` }))];
  } catch (error) {
    console.error("Sitemap: failed to load teams", error);
    return pages;
  }
}
