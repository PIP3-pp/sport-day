import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

// Admin-only auth. Public sign-up is disabled; accounts are created with
// `npm run admin:create`, so every authenticated user is an administrator.
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  // Counters live in the database: in-memory counters are per serverless
  // instance, so they would not stop a brute-force across instances.
  rateLimit: { storage: "database" },
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 10,
  },
  plugins: [nextCookies()],
});
