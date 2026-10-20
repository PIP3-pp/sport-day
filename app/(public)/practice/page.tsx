import { ClipboardList } from "lucide-react";
import type { Metadata } from "next";
import { PracticeTable } from "@/components/practice/practice-table";
import { TeamFilter } from "@/components/schedule/team-filter";
import { EmptyState } from "@/components/shared/empty-state";
import { RevealItem } from "@/components/shared/reveal";
import { PageHeader } from "@/components/shared/section-heading";
import { SportFilter } from "@/components/shared/sport-filter";
import { requirePageVisible } from "@/lib/queries/config";
import { getPracticeSessions, groupBySport } from "@/lib/queries/practice";
import { getTeams } from "@/lib/queries/teams";

export const metadata: Metadata = { title: "ตารางซ้อม" };
export const dynamic = "force-dynamic";

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; team?: string }>;
}) {
  await requirePageVisible("practicePage");
  const { sport, team } = await searchParams;
  const [sessions, teams] = await Promise.all([getPracticeSessions(), getTeams()]);

  const allGroups = groupBySport(sessions);
  const sportId = allGroups.find((g) => String(g.sport.id) === sport)?.sport.id;
  const teamId = teams.find((t) => String(t.id) === team)?.id;
  const groups = allGroups
    .filter((group) => !sportId || group.sport.id === sportId)
    .map((group) => ({
      ...group,
      sessions: group.sessions.filter((s) => !teamId || s.team.id === teamId),
    }))
    .filter((group) => group.sessions.length > 0);

  // Changing the sport keeps the team and vice versa.
  const href = (sport: number | undefined, team: number | undefined) => {
    const params = new URLSearchParams();
    if (sport) params.set("sport", String(sport));
    if (team) params.set("team", String(team));
    const query = params.toString();
    return query ? `/practice?${query}` : "/practice";
  };

  return (
    <>
      <PageHeader
        eyebrow="Practice"
        title="ตารางซ้อม"
        description="เลือกกีฬาเพื่อดูวัน เวลา และสถานที่ซ้อมของแต่ละสี"
      />
      <div className="container-page space-y-6 py-8">
        {allGroups.length > 0 && (
          <div className="space-y-2">
            <SportFilter
              sports={allGroups.map((g) => g.sport)}
              selectedId={sportId}
              hrefFor={(id) => href(id, teamId)}
            />
            <TeamFilter
              teams={teams}
              selectedId={teamId}
              hrefFor={(id) => href(sportId, id)}
            />
          </div>
        )}
        {groups.length > 0 ? (
          <div className="space-y-6">
            {groups.map((group, i) => (
              <RevealItem key={group.sport.id} index={i}>
                <PracticeTable group={group} />
              </RevealItem>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ClipboardList}
            message={
              allGroups.length > 0 ? "ไม่มีตารางซ้อมตามตัวกรองที่เลือก" : "ยังไม่มีตารางซ้อม"
            }
          />
        )}
      </div>
    </>
  );
}
