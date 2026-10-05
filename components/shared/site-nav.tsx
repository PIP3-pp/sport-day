"use client";

import { CalendarDays, Home, Images, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/results", label: "Results", icon: Trophy },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/gallery", label: "Gallery", icon: Images },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop: links in the top bar. */
export function DesktopNav() {
  const isActive = useIsActive();
  return (
    <nav aria-label="เมนูหลัก" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                isActive(href) && "bg-muted text-foreground",
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Mobile: a fixed tab bar within thumb reach. */
export function MobileNav() {
  const isActive = useIsActive();
  return (
    <nav
      aria-label="เมนูหลัก"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-5">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground",
                isActive(href) && "text-foreground",
              )}
            >
              <Icon aria-hidden className="size-5" strokeWidth={isActive(href) ? 2.5 : 2} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
