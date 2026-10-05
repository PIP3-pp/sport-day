import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบผู้ดูแล",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getAdminSession()) redirect("/admin");

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 sm:p-8">
        <p className="eyebrow mb-1">Sports Day Admin</p>
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight">เข้าสู่ระบบผู้ดูแล</h1>
        <LoginForm />
      </div>
    </main>
  );
}
