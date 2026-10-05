import Image from "next/image";
import Link from "next/link";
import { DesktopNav, MobileNav } from "@/components/shared/site-nav";
import { getSiteConfigSafe } from "@/lib/queries/config";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfigSafe();
  const title = `${config.eventName} ${config.eventYear}`;

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
      >
        ข้ามไปยังเนื้อหา
      </a>
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-sm">
        <div className="container-page flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            {config.schoolLogoUrl && (
              <Image
                src={config.schoolLogoUrl}
                alt="โลโก้โรงเรียน"
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-sm object-contain"
              />
            )}
            <span className="truncate text-sm font-extrabold tracking-tight uppercase">
              {title}
            </span>
          </Link>
          <DesktopNav />
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-card pb-14 md:pb-0">
        <div className="container-page flex flex-col gap-1 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-foreground uppercase">{title}</p>
          {config.slogan && <p>{config.slogan}</p>}
        </div>
      </footer>
      <MobileNav />
    </div>
  );
}
