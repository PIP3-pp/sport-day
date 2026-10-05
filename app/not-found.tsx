import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="text-center">
        <p className="text-7xl font-black tracking-tighter">404</p>
        <p className="mt-2 text-muted-foreground">ไม่พบหน้าที่ต้องการ</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-foreground px-5 text-sm font-semibold text-background"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </main>
  );
}
