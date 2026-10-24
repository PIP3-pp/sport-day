/** Cover media the admin can upload for the top of the home page. */
export const BANNER_TYPES: Record<string, { contentType: string; kind: "image" | "video" }> = {
  png: { contentType: "image/png", kind: "image" },
  jpg: { contentType: "image/jpeg", kind: "image" },
  jpeg: { contentType: "image/jpeg", kind: "image" },
  gif: { contentType: "image/gif", kind: "image" },
  // No SVG: opened directly from the Blob store, an SVG file can run scripts.
  webp: { contentType: "image/webp", kind: "image" },
  mov: { contentType: "video/quicktime", kind: "video" },
  mp4: { contentType: "video/mp4", kind: "video" },
};

export const BANNER_ACCEPT = Object.keys(BANNER_TYPES)
  .map((ext) => `.${ext}`)
  .join(",");

export const BANNER_MAX_BYTES = 50 * 1024 * 1024;

export const DEFAULT_BANNER_URL = "/banner.webp";

export function fileExtension(name: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(name);
  return match ? match[1].toLowerCase() : "";
}

export function bannerKind(url: string): "image" | "video" {
  return BANNER_TYPES[fileExtension(new URL(url, "https://x").pathname)]?.kind ?? "image";
}

/**
 * A Vercel Blob URL in the banner/ folder with a supported extension. The server
 * also checks that the file is in this project's own store (see setBanner).
 */
export function isAllowedBannerUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".public.blob.vercel-storage.com") &&
      url.pathname.startsWith("/banner/") &&
      fileExtension(url.pathname) in BANNER_TYPES
    );
  } catch {
    return false;
  }
}
