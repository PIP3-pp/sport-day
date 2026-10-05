import Link from "next/link";
import { dateParts } from "@/lib/date";
import { cn } from "@/lib/utils";

/** Horizontally scrollable day picker. Plain links, so it works without JavaScript. */
export function DateSelector({
  dates,
  selected,
  today,
  hrefFor,
}: {
  dates: string[];
  selected: string;
  today: string;
  hrefFor: (date: string) => string;
}) {
  return (
    <nav aria-label="เลือกวันแข่งขัน">
      <ul className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {dates.map((date) => {
          const { day, month, weekday } = dateParts(date);
          const isSelected = date === selected;
          return (
            <li key={date}>
              <Link
                href={hrefFor(date)}
                aria-current={isSelected ? "date" : undefined}
                className={cn(
                  "flex w-16 flex-col items-center rounded-lg border bg-card py-2.5 transition-colors hover:border-foreground",
                  isSelected && "border-foreground bg-foreground text-background",
                )}
              >
                <span className="text-xs opacity-70">
                  {date === today ? "วันนี้" : weekday}
                </span>
                <span className="text-xl leading-tight font-black tabular-nums">{day}</span>
                <span className="text-xs opacity-70">{month}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
