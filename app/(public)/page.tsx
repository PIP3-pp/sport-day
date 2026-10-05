import { CalendarDays, Megaphone, Star, Trophy } from "lucide-react";
import { AnnouncementList } from "@/components/home/announcements";
import { GalleryLink } from "@/components/home/gallery-cta";
import { Hero } from "@/components/home/hero";
import { HighlightCard } from "@/components/home/highlight";
import { LatestResults } from "@/components/home/latest-results";
import { Standings } from "@/components/home/standings";
import { TodayOverview } from "@/components/home/today-overview";
import { EmptyState } from "@/components/shared/empty-state";
import { MatchCard } from "@/components/shared/match-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { todayInBangkok } from "@/lib/date";
import { getPublishedAnnouncements } from "@/lib/queries/announcements";
import { getSiteConfig } from "@/lib/queries/config";
import { getActiveHighlight } from "@/lib/queries/highlights";
import { getLatestResults, getMatch, getMatchesByDate } from "@/lib/queries/matches";
import { getStandings } from "@/lib/queries/standings";

// "Today" depends on the request time; the queries themselves are cached.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const today = todayInBangkok();
  const [config, standings, todayMatches, latestResults, highlight, announcements] =
    await Promise.all([
      getSiteConfig(),
      getStandings(),
      getMatchesByDate(today),
      getLatestResults(8),
      getActiveHighlight(today),
      getPublishedAnnouncements(5),
    ]);
  const highlightMatch = highlight?.matchId ? await getMatch(highlight.matchId) : null;

  return (
    <>
      <Hero config={config} teams={[...standings].sort((a, b) => a.id - b.id)} />

      <div className="container-page space-y-12 py-8 sm:space-y-16 sm:py-12">
        <div className="space-y-4">
          <Standings standings={standings} />
          <TodayOverview date={today} matches={todayMatches} />
        </div>

        <section>
          <SectionHeading title="ผลการแข่งขันล่าสุด" eyebrow="Latest Results" href="/results" />
          {latestResults.length > 0 ? (
            <LatestResults matches={latestResults} />
          ) : (
            <EmptyState icon={Trophy} message="ยังไม่มีผลการแข่งขัน" />
          )}
        </section>

        <section>
          <SectionHeading title="การแข่งขันวันนี้" eyebrow="Today's Schedule" href="/schedule" />
          {todayMatches.length > 0 ? (
            <div className="space-y-3">
              {todayMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <EmptyState icon={CalendarDays} message="ยังไม่มีการแข่งขันในวันนี้" />
          )}
        </section>

        <section aria-label="Highlight of the Day">
          {highlight ? (
            <HighlightCard highlight={highlight} match={highlightMatch} />
          ) : (
            <EmptyState icon={Star} message="ยังไม่มี Highlight ประจำวันนี้" />
          )}
        </section>

        <section>
          <SectionHeading title="ข่าวสาร" eyebrow="Announcements" />
          {announcements.length > 0 ? (
            <AnnouncementList announcements={announcements} />
          ) : (
            <EmptyState icon={Megaphone} message="ยังไม่มีประกาศ" />
          )}
        </section>

        <section aria-label="Gallery">
          <GalleryLink url={config.galleryDriveUrl} />
        </section>
      </div>
    </>
  );
}
