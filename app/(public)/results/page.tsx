import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import { ResultList } from "@/components/results/result-list";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/section-heading";
import { SportFilter } from "@/components/shared/sport-filter";
import { getCompletedMatches } from "@/lib/queries/matches";
import { getActiveSports } from "@/lib/queries/sports";

export const metadata: Metadata = { title: "ผลการแข่งขัน" };
export const dynamic = "force-dynamic";

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>;
}) {
  const { sport } = await searchParams;
  const sports = await getActiveSports();
  const sportId = sports.find((s) => String(s.id) === sport)?.id;
  const matches = await getCompletedMatches(sportId);

  return (
    <>
      <PageHeader
        eyebrow="Results"
        title="ผลการแข่งขัน"
        description="ผลการแข่งขันที่เสร็จสิ้นแล้วทั้งหมด เรียงจากล่าสุด"
      />
      <div className="container-page space-y-6 py-8">
        <SportFilter
          sports={sports}
          selectedId={sportId}
          hrefFor={(id) => (id ? `/results?sport=${id}` : "/results")}
        />
        {matches.length > 0 ? (
          <ResultList matches={matches} />
        ) : (
          <EmptyState icon={Trophy} message="ยังไม่มีผลการแข่งขัน" />
        )}
      </div>
    </>
  );
}
