import Link from "next/link";
import { AdminPageHeader, EmptyRow, Panel } from "@/components/admin/admin-page";
import { MatchWhat, MatchWho } from "@/components/admin/match-summary";
import { StatusBadge } from "@/components/shared/status-badge";
import { TeamBadge } from "@/components/shared/team-badge";
import { formatDisplayDate, formatThaiDate, formatTime, todayInBangkok } from "@/lib/date";
import { fetchMatchesOnDate, fetchRecentResults } from "@/lib/queries/matches";
import { fetchStandings } from "@/lib/queries/standings";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const today = todayInBangkok();
  const [todayMatches, recentResults, standings] = await Promise.all([
    fetchMatchesOnDate(today),
    fetchRecentResults(5),
    fetchStandings(),
  ]);
  const stats = [
    { label: "การแข่งขันวันนี้", value: todayMatches.length },
    { label: "กำลังแข่ง", value: todayMatches.filter((m) => m.status === "in_progress").length },
    { label: "เสร็จสิ้น", value: todayMatches.filter((m) => m.status === "completed").length },
    { label: "ยังไม่เริ่ม", value: todayMatches.filter((m) => m.status === "scheduled").length },
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" description={formatDisplayDate(today)} />
      <div className="space-y-6">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse rounded-lg border bg-card p-4">
              <dt className="text-xs text-muted-foreground sm:text-sm">{stat.label}</dt>
              <dd className="text-3xl font-black tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-6 lg:grid-cols-5">
          <Panel title="การแข่งขันวันนี้" className="lg:col-span-3">
            {todayMatches.length === 0 ? (
              <EmptyRow message="ยังไม่มีการแข่งขันในวันนี้" />
            ) : (
              <ul className="divide-y">
                {todayMatches.map((match) => (
                  <li key={match.id} className="flex items-center gap-4 px-4 py-3 text-sm">
                    <span className="w-12 font-bold tabular-nums">
                      {formatTime(match.startTime)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <MatchWhat match={match} />
                    </div>
                    <StatusBadge status={match.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="คะแนนรวมปัจจุบัน" className="lg:col-span-2">
            <ol className="divide-y">
              {standings.map((row) => (
                <li key={row.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <span className="w-4 font-bold tabular-nums">{row.rank}</span>
                  <TeamBadge team={row} className="flex-1 font-medium" />
                  <span className="font-bold tabular-nums">{row.total}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <Panel title="ผลการแข่งขันล่าสุด">
          {recentResults.length === 0 ? (
            <EmptyRow message="ยังไม่มีผลการแข่งขัน" />
          ) : (
            <ul className="divide-y">
              {recentResults.map((match) => (
                <li
                  key={match.id}
                  className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[8rem_1fr_1fr] sm:items-center"
                >
                  <span className="text-muted-foreground">{formatThaiDate(match.date)}</span>
                  <MatchWhat match={match} />
                  <MatchWho match={match} />
                </li>
              ))}
            </ul>
          )}
          <p className="border-t px-4 py-3 text-sm">
            <Link href="/admin/results" className="font-medium underline-offset-4 hover:underline">
              ไปที่หน้าบันทึกผล
            </Link>
          </p>
        </Panel>
      </div>
    </>
  );
}
