import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ResultList } from "@/components/results/result-list";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/section-heading";
import { getCompletedMatches } from "@/lib/queries/matches";
import { getActiveSports } from "@/lib/queries/sports";
import { cn } from "@/lib/utils";

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

  const filters = [
    { href: "/results", label: "ทั้งหมด", active: sportId === undefined },
    ...sports.map((s) => ({
      href: `/results?sport=${s.id}`,
      label: `${s.icon ?? ""} ${s.name}`.trim(),
      active: s.id === sportId,
    })),
  ];

  return (
    <>
      <PageHeader
        eyebrow="Results"
        title="ผลการแข่งขัน"
        description="ผลการแข่งขันที่เสร็จสิ้นแล้วทั้งหมด เรียงจากล่าสุด"
      />
      <div className="container-page space-y-6 py-8">
        {sports.length > 0 && (
          <nav aria-label="กรองตามกีฬา">
            <ul className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {filters.map((filter) => (
                <li key={filter.href}>
                  <Link
                    href={filter.href}
                    aria-current={filter.active ? "true" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center rounded-full border bg-card px-4 text-sm font-medium whitespace-nowrap transition-colors hover:border-foreground",
                      filter.active && "border-foreground bg-foreground text-background",
                    )}
                  >
                    {filter.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {matches.length > 0 ? (
          <ResultList matches={matches} />
        ) : (
          <EmptyState icon={Trophy} message="ยังไม่มีผลการแข่งขัน" />
        )}
      </div>
    </>
  );
}
