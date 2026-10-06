import type { MetadataRoute } from "next";
import { getSiteConfigSafe } from "@/lib/queries/config";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const config = await getSiteConfigSafe();
  const name = `${config.eventName} ${config.eventYear}`;
  return {
    name,
    short_name: config.eventName,
    description: "ตารางการแข่งขัน ผลการแข่งขัน และคะแนนรวมกีฬาสีโรงเรียน",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f5",
    theme_color: "#111111",
    lang: "th",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
