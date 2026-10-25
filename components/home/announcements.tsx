import { ChevronDown, FileText, Image as ImageIcon } from "lucide-react";
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
            <div className="grid gap-3 px-4 pb-4 sm:px-5">
              {item.content && <p className="whitespace-pre-line text-muted-foreground">{item.content}</p>}
              {item.attachmentUrl && item.attachmentType === "image" && (
                <a href={item.attachmentUrl} target="_blank" rel="noreferrer" className="block w-fit max-w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.attachmentUrl} alt={item.attachmentName ?? `รูปประกอบ: ${item.title}`} className="max-h-[28rem] max-w-full rounded-lg border object-contain" />
                </a>
              )}
              {item.attachmentUrl && item.attachmentType === "pdf" && (
                <a href={item.attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
                  <FileText aria-hidden className="size-4" /> เปิดเอกสาร PDF: {item.attachmentName ?? "ดูเอกสารแนบ"}
                </a>
              )}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
