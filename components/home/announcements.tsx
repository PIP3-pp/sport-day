import { ChevronDown } from "lucide-react";
import type { Announcement } from "@/lib/queries/announcements";
import { formatThaiDate } from "@/lib/date";

export function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  return (
    <ul className="divide-y rounded-lg border bg-card">
      {announcements.map((item) => (
        <li key={item.id}>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-muted/50 sm:px-5 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">
                <span className="block font-semibold">{item.title}</span>
                <time
                  dateTime={item.publishedAt}
                  className="text-sm text-muted-foreground"
                >
                  {formatThaiDate(item.publishedAt)}
                </time>
              </span>
              <ChevronDown
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="px-4 pb-4 whitespace-pre-line text-muted-foreground sm:px-5">
              {item.content}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}
