import { ExternalLink, LogOut } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { requireAdmin } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[14rem_1fr]">
      <aside className="border-b bg-card lg:border-r lg:border-b-0">
        <div className="flex h-14 items-center justify-between gap-3 border-b px-4 lg:px-6">
          <Link href="/admin" className="text-sm font-extrabold tracking-tight uppercase">
            Sports Day Admin
          </Link>
          <form action={signOut} className="lg:hidden">
            <Button type="submit" variant="outline" size="sm">
              <LogOut aria-hidden />
              ออกจากระบบ
            </Button>
          </form>
        </div>
        <AdminNav />
      </aside>

      <div className="min-w-0">
        <header className="hidden h-14 items-center justify-between gap-4 border-b bg-card px-6 lg:flex">
          <p className="truncate text-sm text-muted-foreground">{session.user.email}</p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/" target="_blank" />}>
              ดูหน้าเว็บ
              <ExternalLink aria-hidden />
            </Button>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut aria-hidden />
                ออกจากระบบ
              </Button>
            </form>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
