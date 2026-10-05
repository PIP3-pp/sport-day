import { ArrowLeft, Trophy } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResultList } from "@/components/results/result-list";
import { EmptyState } from "@/components/shared/empty-state";
import { TeamLogo } from "@/components/shared/team-badge";
import { getTeamResults } from "@/lib/queries/matches";
import { getStandings } from "@/lib/queries/standings";
import { getTeamBySlug } from "@/lib/queries/teams";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);
  return team ? { title: team.name, description: team.slogan ?? undefined } : {};
}

export default async function TeamPage({ params }: Props) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);
  if (!team) notFound();

  const [standings, matches] = await Promise.all([getStandings(), getTeamResults(team.id)]);
  const standing = standings.find((row) => row.id === team.id);

  return (
    <>
      <header className="border-b bg-card">
        <span aria-hidden className="block h-2" style={{ backgroundColor: team.color }} />
        <div className="container-page py-8 sm:py-12">
          <Link
            href="/teams"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft aria-hidden className="size-4" />
            ทีมสีทั้งหมด
          </Link>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <TeamLogo team={team} size={72} />
              <div className="min-w-0">
                <p className="eyebrow mb-1">
                  {team.slug.replace("-", " ")} · {team.color}
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {team.name}
                </h1>
                {team.slogan && <p className="mt-1 text-muted-foreground">{team.slogan}</p>}
              </div>
            </div>
            <dl className="flex gap-8">
              <div className="flex flex-col-reverse">
                <dt className="eyebrow">คะแนนรวม</dt>
                <dd className="text-4xl font-black tabular-nums">{standing?.total ?? 0}</dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="eyebrow">อันดับ</dt>
                <dd className="text-4xl font-black tabular-nums">{standing?.rank ?? "–"}</dd>
              </div>
            </dl>
          </div>
          {team.description && (
            <p className="mt-6 max-w-prose whitespace-pre-line text-muted-foreground">
              {team.description}
            </p>
          )}
        </div>
      </header>

      <div className="container-page py-8">
        <p className="eyebrow mb-4">ผลการแข่งขันของ{team.name}</p>
        {matches.length > 0 ? (
          <ResultList matches={matches} />
        ) : (
          <EmptyState icon={Trophy} message="ยังไม่มีผลการแข่งขัน" />
        )}
      </div>
    </>
  );
}
