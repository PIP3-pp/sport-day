import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/section-heading";
import { CountUp } from "@/components/shared/motion";
import { RevealItem } from "@/components/shared/reveal";
import { TeamLogo } from "@/components/shared/team-badge";
import { getStandings } from "@/lib/queries/standings";

export const metadata: Metadata = { title: "ทีมสี" };
export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const standings = await getStandings();

  return (
    <>
      <PageHeader eyebrow="Teams" title="ทีมสี" description="คะแนนรวมและข้อมูลของแต่ละสี" />
      <div className="container-page py-8">
        <ul className="grid gap-4 sm:grid-cols-2">
          {standings.map((team, index) => (
            <li key={team.id}>
              <RevealItem index={index} className="h-full">
              <Link
                href={`/teams/${team.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground hover:shadow-md"
              >
                <span aria-hidden className="h-1.5" style={{ backgroundColor: team.color }} />
                <span className="flex flex-1 items-center gap-4 p-5">
                  <TeamLogo team={team} size={56} />
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow block">อันดับ {team.rank}</span>
                    <span className="block text-xl font-extrabold tracking-tight">
                      {team.name}
                    </span>
                    {team.slogan && (
                      <span className="block truncate text-sm text-muted-foreground">
                        {team.slogan}
                      </span>
                    )}
                  </span>
                  <span className="text-right">
                    <CountUp value={team.total} className="block text-3xl font-black tabular-nums" />
                    <span className="eyebrow">PTS</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
              </RevealItem>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
