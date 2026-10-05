import { ArrowUpRight, Images } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

/** Link out to the Google Drive album; the site does not host photos itself. */
export function GalleryLink({ url }: { url: string | null }) {
  if (!url) {
    return <EmptyState icon={Images} message="ยังไม่มีลิงก์ภาพกิจกรรม" />;
  }
  return (
    <div className="flex flex-col items-start gap-5 rounded-lg border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div>
        <p className="eyebrow mb-1">Gallery</p>
        <p className="text-lg font-bold tracking-tight">
          ดูภาพบรรยากาศและภาพการแข่งขันทั้งหมด
        </p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-semibold text-background transition-all hover:bg-foreground/85 active:scale-95"
      >
        เปิด Google Drive
        <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        <span className="sr-only">(เปิดในแท็บใหม่)</span>
      </a>
    </div>
  );
}
