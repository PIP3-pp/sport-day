import { ImageResponse } from "next/og";
import { getSiteConfigSafe } from "@/lib/queries/config";
import { getStandings, type Standing } from "@/lib/queries/standings";

export const alt = "คะแนนรวมกีฬาสี";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

// The built-in font has no Thai glyphs, so the card shows only Latin text and numbers.
const isLatin = (text: string) => /^[\x20-\x7e]+$/.test(text);
const label = (team: Standing) => team.slug.replace("-", " ").toUpperCase();

/** Share card for links: event name plus the live standings as colored bars. */
export default async function OpengraphImage() {
  const config = await getSiteConfigSafe();
  let standings: Standing[] = [];
  try {
    standings = await getStandings();
  } catch (error) {
    console.error("OG image: failed to load standings", error);
  }
  const name = isLatin(config.eventName) ? config.eventName.toUpperCase() : "SPORTS DAY";
  const max = Math.max(1, ...standings.map((team) => team.total));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#111111",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 112, fontWeight: 900, lineHeight: 1 }}>{name}</div>
          <div
            style={{ display: "flex", fontSize: 112, fontWeight: 900, lineHeight: 1, opacity: 0.5 }}
          >
            {config.eventYear}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {standings.map((team) => (
            <div key={team.id} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", width: 150, fontSize: 28, opacity: 0.7 }}>{label(team)}</div>
              <div
                style={{
                  height: 28,
                  width: Math.max(12, Math.round((team.total / max) * 720)),
                  background: team.color,
                }}
              />
              <div style={{ display: "flex", fontSize: 32, fontWeight: 800 }}>{team.total}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
