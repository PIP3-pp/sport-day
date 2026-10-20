import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import { DateSelector } from "@/components/schedule/date-selector";
import { EmptyState } from "@/components/shared/empty-state";
import { RevealItem } from "@/components/shared/reveal";
import { MatchCard } from "@/components/shared/match-card";
import { PageHeader } from "@/components/shared/section-heading";
import { TeamFilter } from "@/components/schedule/team-filter";
import { SportFilter } from "@/components/shared/sport-filter";
import { formatDisplayDate, isValidDateString, todayInBangkok } from "@/lib/date";
import { requirePageVisible } from "@/lib/queries/config";
import { getMatchDates, getMatchesByDate } from "@/lib/queries/matches";
import { getActiveSports } from "@/lib/queries/sports";
import { getTeams } from "@/lib/queries/teams";

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
  searchParams: Promise<{ date?: string; sport?: string; team?: string }>;
}) {
  await requirePageVisible("schedulePage");
  const { date: requested, sport, team } = await searchParams;
  const today = todayInBangkok();
  const [dates, sports, teams] = await Promise.all([
    getMatchDates(),
    getActiveSports(),
    getTeams(),
  ]);
  // Only match days (or today) are looked up, so arbitrary ?date= values can't
  // create database queries and cache entries.
  const selected =
    requested &&
    isValidDateString(requested) &&
    (requested === today || dates.includes(requested))
      ? requested
      : defaultDate(dates, today);
  const sportId = sports.find((s) => String(s.id) === sport)?.id;
  const teamId = teams.find((t) => String(t.id) === team)?.id;

  const dayMatches = await getMatchesByDate(selected);
  // A team plays in its own matches and in every all-teams event.
  const matches = dayMatches.filter(
    (match) =>
      (!sportId || match.sport.id === sportId) &&
      (!teamId ||
        match.format === "all_teams" ||
        match.teamA?.id === teamId ||
        match.teamB?.id === teamId),
  );

  // Changing the day, sport or team keeps the other two.
  const href = (date: string, sport: number | undefined, team: number | undefined) =>
    `/schedule?date=${date}${sport ? `&sport=${sport}` : ""}${team ? `&team=${team}` : ""}`;

  const emptyMessage = sportId || teamId
    ? "ไม่มีการแข่งขันตามตัวกรองในวันที่เลือก"
    : selected === today
      ? "ยังไม่มีการแข่งขันในวันนี้"
      : "ยังไม่มีการแข่งขันในวันที่เลือก";

  return (
    <>
      <PageHeader
        eyebrow="Schedule"
        title="ตารางการแข่งขัน"
        description="เลือกวันและกีฬาเพื่อดูตารางการแข่งขัน"
      />
      <div className="container-page space-y-6 py-8">
        {dates.length > 0 && (
          <DateSelector
            dates={dates}
            selected={selected}
            today={today}
            hrefFor={(date) => href(date, sportId, teamId)}
          />
        )}
        <section>
          <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
            <time dateTime={selected}>{formatDisplayDate(selected)}</time>
          </h2>
          <div className="mb-4 space-y-2">
            <SportFilter
              sports={sports}
              selectedId={sportId}
              hrefFor={(id) => href(selected, id, teamId)}
            />
            <TeamFilter
              teams={teams}
              selectedId={teamId}
              hrefFor={(id) => href(selected, sportId, id)}
            />
          </div>
          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((match, i) => (
                <RevealItem key={match.id} index={i}>
                  <MatchCard match={match} />
                </RevealItem>
              ))}
            </div>
          ) : (
            <EmptyState icon={CalendarDays} message={emptyMessage} />
          )}
        </section>
      </div>
    </>
  );
}
