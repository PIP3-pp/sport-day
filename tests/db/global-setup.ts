import path from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { testDatabaseUrl } from "./env";

/** Applies db/migrations to the test database once before the suite. */
export default async function setup() {
  try {
    const pool = new Pool({ connectionString: testDatabaseUrl(), max: 1 });
    try {
      await migrate(drizzle(pool), {
        migrationsFolder: path.resolve(import.meta.dirname, "../../db/migrations"),
      });
    } finally {
      await pool.end();
    }
  } catch (error) {
    // Vitest can fail to print errors thrown here, so say why before stopping.
    console.error(`\n[test:db] ${error instanceof Error ? error.message : error}\n`);
    throw error;
  }
}
