import { ChevronDown } from "lucide-react";
import Link from "next/link";

/** "Show more" as a plain link, so it works without JavaScript. */
export function ShowMore({ href }: { href: string }) {
  return (
    <div className="mt-8 flex justify-center">
      <Link
        href={href}
        scroll={false}
        className="inline-flex h-11 items-center gap-2 rounded-md border bg-card px-5 text-sm font-semibold transition-all hover:border-foreground active:scale-95"
      >
        ดูผลการแข่งขันเพิ่มเติม
        <ChevronDown aria-hidden className="size-4" />
      </Link>
    </div>
  );
}
