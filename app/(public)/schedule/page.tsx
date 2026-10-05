import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import { DateSelector } from "@/components/schedule/date-selector";
import { EmptyState } from "@/components/shared/empty-state";
import { MatchCard } from "@/components/shared/match-card";
import { PageHeader } from "@/components/shared/section-heading";
import { formatDisplayDate, isValidDateString, todayInBangkok } from "@/lib/date";
import { getMatchDates, getMatchesByDate } from "@/lib/queries/matches";

export const metadata: Metadata = { title: "ตารางการแข่งขัน" };
export const dynamic = "force-dynamic";

/** Today if it has matches, otherwise the next match day, otherwise the last one. */
function defaultDate(dates: string[], today: string) {
  if (dates.length === 0) return today;
  return dates.find((date) => date >= today) ?? dates[dates.length - 1];
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: requested } = await searchParams;
  const today = todayInBangkok();
  const dates = await getMatchDates();
  const selected =
    requested && isValidDateString(requested) ? requested : defaultDate(dates, today);
  const matches = await getMatchesByDate(selected);

  return (
    <>
      <PageHeader
        eyebrow="Schedule"
        title="ตารางการแข่งขัน"
        description="เลือกวันเพื่อดูการแข่งขันทั้งหมดของวันนั้น"
      />
      <div className="container-page space-y-6 py-8">
        {dates.length > 0 && (
          <DateSelector dates={dates} selected={selected} today={today} />
        )}
        <section>
          <h2 className="mb-4 text-xl font-bold tracking-tight">
            <time dateTime={selected}>{formatDisplayDate(selected)}</time>
          </h2>
          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              message={
                selected === today
                  ? "ยังไม่มีการแข่งขันในวันนี้"
                  : "ยังไม่มีการแข่งขันในวันที่เลือก"
              }
            />
          )}
        </section>
      </div>
    </>
  );
}
