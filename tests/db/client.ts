import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";
import { testDatabaseUrl } from "./env";

// Stands in for "@/db" (see setup.ts), so app code never reads DATABASE_URL.
export const pool = new Pool({ connectionString: testDatabaseUrl(), max: 2 });
export const db = drizzle(pool, { schema });
