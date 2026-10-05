// Creates an administrator account from ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME
// in .env.local. Run with: npm run admin:create
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";
  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local first.");
  }

  const { betterAuth } = await import("better-auth");
  const { drizzleAdapter } = await import("better-auth/adapters/drizzle");
  const { db, pool } = await import("../db");
  const schema = await import("../db/schema");

  // Same configuration as lib/auth.ts, but with sign-up allowed for this script only.
  const auth = betterAuth({
    database: drizzleAdapter(db, { provider: "pg", schema }),
    emailAndPassword: { enabled: true, minPasswordLength: 10 },
  });

  await auth.api.signUpEmail({ body: { email, password, name } });
  console.log(`Created admin account: ${email}`);
  await pool.end();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
