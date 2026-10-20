// Applies pending migrations before a Vercel production build (`npm run vercel-build`).
// Preview builds are skipped so unmerged branches never change the live database.
// Uses the same "drizzle" migrations table as `npm run db:migrate`.
import { migrate } from "drizzle-orm/node-postgres/migrator";

async function main() {
  const env = process.env.VERCEL_ENV;
  if (env !== "production") {
    console.log(`[migrate] Skipped: VERCEL_ENV is "${env ?? "unset"}", not "production".`);
    return;
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("[migrate] DATABASE_URL is not set for the Production environment.");
  }

  const { db, pool } = await import("../db");
  try {
    console.log("[migrate] Applying pending migrations...");
    await migrate(db, { migrationsFolder: "db/migrations" });
    console.log("[migrate] Database is up to date.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("[migrate] Failed:", error);
  process.exit(1);
});
