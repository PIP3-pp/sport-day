import Link from "next/link";
import type { Sport } from "@/lib/queries/sports";
import { cn } from "@/lib/utils";

/** "All" + one chip per sport. Plain links, so it works without JavaScript. */
export function SportFilter({
  sports,
  selectedId,
  hrefFor,
}: {
  sports: Sport[];
  selectedId: number | undefined;
  /** Builds the link for a sport, or for "all" when called with undefined. */
  hrefFor: (sportId: number | undefined) => string;
}) {
  if (sports.length === 0) return null;

  const filters = [
    { id: undefined, label: "ทั้งหมด" },
    ...sports.map((sport) => ({
      id: sport.id,
      label: `${sport.icon ?? ""} ${sport.name}`.trim(),
    })),
  ];

  return (
    <nav aria-label="กรองตามกีฬา">
      <ul className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {filters.map((filter) => {
          const active = filter.id === selectedId;
          return (
            <li key={filter.id ?? "all"}>
              <Link
                href={hrefFor(filter.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border bg-card px-4 text-sm font-medium whitespace-nowrap transition-colors hover:border-foreground",
                  active && "border-foreground bg-foreground text-background",
                )}
              >
                {filter.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
