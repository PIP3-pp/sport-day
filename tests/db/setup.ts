import { afterAll, beforeEach, vi } from "vitest";
import { pool } from "./client";

// Module-boundary mocks: the app code under test runs unchanged.
vi.mock("server-only", () => ({}));
vi.mock("@/db", async () => {
  const { db, pool } = await import("./client");
  return { db, pool };
});
vi.mock("next/cache", () => ({
  updateTag: vi.fn(),
  unstable_cache: <T>(fn: T) => fn,
}));
vi.mock("@/lib/require-admin", () => ({
  getAdminSession: vi.fn(async () => ({ user: { email: "admin@test.local" } })),
}));

let tables: string[] | undefined;

beforeEach(async () => {
  vi.clearAllMocks();
  tables ??= (
    await pool.query<{ tablename: string }>(
      "select tablename from pg_tables where schemaname = 'public'",
    )
  ).rows.map((row) => `"${row.tablename}"`);
  await pool.query(`truncate ${tables.join(", ")} restart identity cascade`);
});

afterAll(async () => {
  await pool.end();
});
