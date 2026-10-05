// Production seed: the four teams and the single site_config row.
// Safe to re-run; existing rows are left untouched.
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { db, pool } = await import("./index");
  const { siteConfig, teams } = await import("./schema");

  await db
    .insert(teams)
    .values([
      { name: "สีแดง", slug: "red", color: "#EF4444" },
      { name: "สีเขียว", slug: "green", color: "#22C55E" },
      { name: "สีฟ้า", slug: "sky-blue", color: "#38BDF8" },
      { name: "สีม่วง", slug: "purple", color: "#A855F7" },
    ])
    .onConflictDoNothing({ target: teams.slug });

  await db
    .insert(siteConfig)
    .values({
      id: 1,
      eventName: "SPORTS DAY",
      eventYear: 2026,
      slogan: "ONE SCHOOL • ONE SPIRIT",
    })
    .onConflictDoNothing({ target: siteConfig.id });

  console.log("Seeded teams and site config.");
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
