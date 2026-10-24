import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname) } },
  test: {
    projects: [
      {
        extends: true,
        test: { name: "unit", include: ["tests/**/*.test.ts"], exclude: ["tests/db/**"] },
      },
      {
        // Runs against a throwaway Postgres from TEST_DATABASE_URL; see README.
        extends: true,
        test: {
          name: "db",
          include: ["tests/db/**/*.test.ts"],
          globalSetup: ["tests/db/global-setup.ts"],
          setupFiles: ["tests/db/setup.ts"],
          // Every file shares one database, and tables are emptied between tests.
          fileParallelism: false,
        },
      },
    ],
  },
});
