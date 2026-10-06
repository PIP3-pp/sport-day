"use client";

import {
  CalendarDays,
  Dumbbell,
  History,
  LayoutDashboard,
  Megaphone,
  Settings,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/matches", label: "Matches", icon: CalendarDays },
  { href: "/admin/results", label: "Results", icon: Trophy },
  { href: "/admin/teams", label: "Teams", icon: Users },
  { href: "/admin/sports", label: "Sports", icon: Dumbbell },
  { href: "/admin/highlights", label: "Highlights", icon: Star },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/activity", label: "Activity", icon: History },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

/** Sidebar on desktop, horizontally scrollable strip on small screens. */
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="เมนูผู้ดูแล">
      <ul className="scrollbar-none flex gap-1 overflow-x-auto px-4 py-2 lg:flex-col lg:px-3 lg:py-4">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-10 items-center gap-2.5 rounded-md px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  active && "text-background hover:bg-transparent hover:text-background",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="admin-nav-pill"
                    className="absolute inset-0 rounded-md bg-foreground"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <Icon aria-hidden className="relative size-4" />
                <span className="relative">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
