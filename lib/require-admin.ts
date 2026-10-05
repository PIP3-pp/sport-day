import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function getAdminSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** For admin pages and layouts: redirects to the login page when signed out. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
