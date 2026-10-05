import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pgPool?: Pool };

// Reuse one pool across hot reloads and warm serverless invocations.
const pool =
  globalForDb.pgPool ??
  new Pool({
    // pg treats sslmode=require as verify-full today; say so explicitly.
    connectionString: process.env.DATABASE_URL?.replace(
      "sslmode=require",
      "sslmode=verify-full",
    ),
    max: 5,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pgPool = pool;

export const db = drizzle(pool, { schema });
export { pool };
