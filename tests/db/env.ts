/**
 * The database tests empty every table, so they only ever use TEST_DATABASE_URL,
 * never DATABASE_URL (which may point at production).
 */
export function testDatabaseUrl(): string {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TEST_DATABASE_URL is not set. The database tests need a throwaway Postgres " +
        "and never fall back to DATABASE_URL. See README (ทดสอบกับฐานข้อมูล).",
    );
  }
  if (url === process.env.DATABASE_URL) {
    throw new Error("TEST_DATABASE_URL must not be the same as DATABASE_URL.");
  }
  const name = decodeURIComponent(new URL(url).pathname.slice(1));
  if (!/test/i.test(name)) {
    throw new Error(
      `Refusing to use database "${name}": its name must contain "test" ` +
        "because every table is emptied between tests.",
    );
  }
  return url;
}
