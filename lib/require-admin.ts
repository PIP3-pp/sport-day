import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";

/** Looked up once per request, however many layouts, pages and actions ask. */
export const getAdminSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

/**
 * For admin pages and layouts: redirects to the login page when signed out.
 * Every page calls it, not only the layout, which may not re-run on navigation.
 */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
