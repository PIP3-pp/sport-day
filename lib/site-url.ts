/** The site's public origin, for absolute URLs in metadata, the sitemap and robots.txt. */
export function siteUrl(): string {
  const explicit = process.env.BETTER_AUTH_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
