import { CalendarDays, Megaphone, Star, Trophy } from "lucide-react";
import { AnnouncementList } from "@/components/home/announcements";
import { Banner } from "@/components/home/banner";
import { GalleryLink } from "@/components/home/gallery-cta";
import { Hero } from "@/components/home/hero";
import { HighlightCard } from "@/components/home/highlight";
import { LatestResults } from "@/components/home/latest-results";
import { Standings } from "@/components/home/standings";
import { TodayOverview } from "@/components/home/today-overview";
import { Reveal, RevealItem } from "@/components/shared/reveal";
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
  const config = await getSiteConfig();
  const show = config.visibility;
  const needsTodayMatches = show.liveMatches || show.todayOverview || show.todayMatches;
  // Sections that are switched off don't query the database at all.
  const [standings, todayMatches, latestResults, highlight, announcements] = await Promise.all([
    getStandings(),
    needsTodayMatches ? getMatchesByDate(today) : [],
    show.latestResults ? getLatestResults(8) : [],
    show.highlight ? getActiveHighlight(today) : null,
    show.announcements ? getPublishedAnnouncements(5) : [],
  ]);
  const liveMatches = todayMatches.filter((match) => match.status === "in_progress");
  const highlightMatch = highlight?.matchId ? await getMatch(highlight.matchId) : null;
  const scheduleHref = show.schedulePage ? "/schedule" : undefined;
  const heroCta = show.practicePage
    ? { href: "/practice", label: "ดูตารางซ้อม" }
    : show.schedulePage
      ? { href: "/schedule", label: "ดูตารางการแข่งขัน" }
      : null;

  return (
    <>
      {show.banner && (
        <Banner
          url={config.bannerUrl}
          alt={
            config.bannerUrl
              ? `${config.eventName} ${config.eventYear}`
              : "กีฬาสีภายใน แคแสดสองแควเกมส์ โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย พิษณุโลก และกำแพงเพชร"
          }
        />
      )}
      {show.hero && (
        <Hero
          config={config}
          teams={[...standings].sort((a, b) => a.id - b.id)}
          cta={heroCta}
        />
      )}

      <div className="container-page space-y-12 py-8 sm:space-y-16 sm:py-12">
        {show.liveMatches && liveMatches.length > 0 && (
          <section aria-label="กำลังแข่งขัน" className="space-y-3">
            <SectionHeading title="กำลังแข่งขัน" eyebrow="Live Now" href={scheduleHref} />
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </section>
        )}

        {(show.standings || show.todayOverview) && (
          <Reveal className="space-y-4">
            {show.standings && <Standings standings={standings} />}
            {show.todayOverview && <TodayOverview date={today} matches={todayMatches} />}
          </Reveal>
        )}

        {show.latestResults && (
        <Reveal>
        <section>
          <SectionHeading title="ผลการแข่งขันล่าสุด" eyebrow="Latest Results" href={show.resultsPage ? "/results" : undefined} />
          {latestResults.length > 0 ? (
            <LatestResults matches={latestResults} />
          ) : (
            <EmptyState icon={Trophy} message="ยังไม่มีผลการแข่งขัน" />
          )}
        </section>
        </Reveal>
        )}

        {show.todayMatches && (
        <Reveal>
        <section>
          <SectionHeading title="การแข่งขันวันนี้" eyebrow="Today's Schedule" href={scheduleHref} />
          {todayMatches.length > 0 ? (
            <div className="space-y-3">
              {todayMatches.map((match, i) => (
                <RevealItem key={match.id} index={i}>
                  <MatchCard match={match} />
                </RevealItem>
              ))}
            </div>
          ) : (
            <EmptyState icon={CalendarDays} message="ยังไม่มีการแข่งขันในวันนี้" />
          )}
        </section>
        </Reveal>
        )}

        {show.highlight && (
        <Reveal>
        <section aria-label="Highlight of the Day">
          {highlight ? (
            <HighlightCard highlight={highlight} match={highlightMatch} />
          ) : (
            <EmptyState icon={Star} message="ยังไม่มี Highlight ประจำวันนี้" />
          )}
        </section>
        </Reveal>
        )}

        {show.announcements && (
        <Reveal>
        <section>
          <SectionHeading title="ข่าวสาร" eyebrow="Announcements" />
          {announcements.length > 0 ? (
            <AnnouncementList announcements={announcements} />
          ) : (
            <EmptyState icon={Megaphone} message="ยังไม่มีประกาศ" />
          )}
        </section>
        </Reveal>
        )}

        {show.gallerySection && (
        <Reveal>
        <section aria-label="Gallery">
          <GalleryLink url={config.galleryDriveUrl} />
        </section>
        </Reveal>
        )}
      </div>
    </>
  );
}
