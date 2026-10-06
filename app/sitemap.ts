import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { getTeams } from "@/lib/queries/teams";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const pages = ["", "/schedule", "/results", "/teams", "/gallery"].map((path) => ({
    url: `${base}${path}`,
  }));
  try {
    const teams = await getTeams();
    return [...pages, ...teams.map((team) => ({ url: `${base}/teams/${team.slug}` }))];
  } catch (error) {
    console.error("Sitemap: failed to load teams", error);
    return pages;
  }
}
