import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Title row of an admin page, with an optional primary action on the right. */
export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-lg border bg-card", className)}>
      {title && <h2 className="border-b px-4 py-3 text-sm font-semibold">{title}</h2>}
      {children}
    </section>
  );
}

export function EmptyRow({ message }: { message: string }) {
  return <p className="px-4 py-10 text-center text-sm text-muted-foreground">{message}</p>;
}

/** Previous/next links for a `?page=` list. Renders nothing when there is a single page. */
export function Pager({
  page,
  hasMore,
  hrefFor,
}: {
  page: number;
  hasMore: boolean;
  hrefFor: (page: number) => string;
}) {
  if (page === 1 && !hasMore) return null;
  const linkClass =
    "inline-flex h-9 items-center gap-1 rounded-md border bg-card px-3 text-sm font-medium transition-colors hover:border-foreground";
  const disabledClass = "inline-flex h-9 items-center gap-1 px-3 text-sm text-muted-foreground/50";
  return (
    <nav aria-label="เปลี่ยนหน้า" className="flex items-center justify-between border-t px-4 py-3">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={linkClass}>
          <ChevronLeft aria-hidden className="size-4" />
          ก่อนหน้า
        </Link>
      ) : (
        <span className={disabledClass}>
          <ChevronLeft aria-hidden className="size-4" />
          ก่อนหน้า
        </span>
      )}
      <span className="text-sm text-muted-foreground tabular-nums">หน้า {page}</span>
      {hasMore ? (
        <Link href={hrefFor(page + 1)} className={linkClass}>
          ถัดไป
          <ChevronRight aria-hidden className="size-4" />
        </Link>
      ) : (
        <span className={disabledClass}>
          ถัดไป
          <ChevronRight aria-hidden className="size-4" />
        </span>
      )}
    </nav>
  );
}
