import type { MatchView } from "@/lib/queries/matches";
import { formatDisplayDate } from "@/lib/date";

export function TodayOverview({ date, matches }: { date: string; matches: MatchView[] }) {
  const completed = matches.filter((m) => m.status === "completed").length;
  const upcoming = matches.filter((m) => m.status === "scheduled").length;
  const stats = [
    { label: "การแข่งขัน", value: matches.length },
    { label: "เสร็จสิ้น", value: completed },
    { label: "ยังไม่เริ่ม", value: upcoming },
  ];

  return (
    <section
      aria-label="ภาพรวมวันนี้"
      className="flex flex-col gap-3 rounded-lg border bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
    >
      <div>
        <p className="eyebrow">Today</p>
        <p className="text-lg font-bold tracking-tight">
          <time dateTime={date}>{formatDisplayDate(date)}</time>
        </p>
      </div>
      <dl className="flex gap-6 sm:gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse">
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
            <dd className="text-2xl font-black tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
