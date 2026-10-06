import { ClipboardPen, Pencil, Trash2 } from "lucide-react";
import { DeleteDialog, FormDialog } from "@/components/admin/action-form";
import { AdminPageHeader, EmptyRow, Pager, Panel } from "@/components/admin/admin-page";
import { MatchWhat, MatchWhen, MatchWho } from "@/components/admin/match-summary";
import { ResultForm } from "@/components/admin/result-form";
import { StartMatchButton } from "@/components/admin/start-match-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteResult, saveResult } from "@/lib/actions/results";
import { parsePage } from "@/lib/pagination";
import { fetchSiteConfig } from "@/lib/queries/config";
import { fetchMatchPage, fetchPendingMatches, type MatchView } from "@/lib/queries/matches";
import { eq } from "drizzle-orm";
import { matches as matchesTable } from "@/db/schema";
import { fetchTeams, type TeamRef } from "@/lib/queries/teams";

function ResultTable({
  matches,
  teams,
  completed,
  rankPoints,
}: {
  matches: MatchView[];
  teams: TeamRef[];
  completed: boolean;
  rankPoints: number[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>วันเวลา</TableHead>
          <TableHead>กีฬา / รอบ</TableHead>
          <TableHead>{completed ? "ผล (สกอร์/อันดับ, คะแนนสะสม)" : "ทีม"}</TableHead>
          <TableHead className="text-right">จัดการ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map((match) => (
          <TableRow key={match.id}>
            <TableCell>
              <MatchWhen match={match} />
            </TableCell>
            <TableCell>
              <MatchWhat match={match} />
              {match.status === "in_progress" && (
                <StatusBadge status={match.status} className="mt-1" />
              )}
            </TableCell>
            <TableCell>
              <MatchWho match={match} />
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                {match.status === "scheduled" && <StartMatchButton matchId={match.id} />}
                <FormDialog
                  action={saveResult}
                  title={completed ? "แก้ไขผลการแข่งขัน" : "บันทึกผลการแข่งขัน"}
                  description={`${match.sport.name} — ${match.round}`}
                  trigger={<Button variant={completed ? "outline" : "default"} size="sm" />}
                  triggerLabel={
                    completed ? (
                      <>
                        <Pencil aria-hidden />
                        แก้ไขผล
                      </>
                    ) : (
                      <>
                        <ClipboardPen aria-hidden />
                        บันทึกผล
                      </>
                    )
                  }
                  submitLabel="บันทึกผล"
                >
                  <ResultForm match={match} teams={teams} rankPoints={rankPoints} />
                </FormDialog>
                {completed && (
                  <DeleteDialog
                    action={deleteResult}
                    id={match.id}
                    title="ลบผลการแข่งขัน"
                    description="คะแนนสะสมของการแข่งขันนี้จะถูกลบ และการแข่งขันจะกลับเป็น “ยังไม่เริ่ม”"
                    triggerLabel={
                      <>
                        <Trash2 aria-hidden />
                        ลบผล
                      </>
                    }
                  />
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const COMPLETED_PAGE_SIZE = 20;

export default async function AdminResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = parsePage((await searchParams).page);
  const [pending, { matches: completed, hasMore }, teams, config] = await Promise.all([
    fetchPendingMatches(),
    fetchMatchPage(eq(matchesTable.status, "completed"), page, COMPLETED_PAGE_SIZE),
    fetchTeams(),
    fetchSiteConfig(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Results"
        description="บันทึกผลเมื่อการแข่งขันจบ ระบบจะตั้งสถานะเป็นเสร็จสิ้นและอัปเดตคะแนนรวมให้อัตโนมัติ"
      />
      <div className="space-y-6">
        <Panel title={`รอบันทึกผล (${pending.length})`}>
          {pending.length === 0 ? (
            <EmptyRow message="ไม่มีการแข่งขันที่รอบันทึกผล" />
          ) : (
            <ResultTable
              matches={pending}
              teams={teams}
              completed={false}
              rankPoints={config.rankPoints}
            />
          )}
        </Panel>
        <Panel title="บันทึกผลแล้ว">
          {completed.length === 0 ? (
            <EmptyRow message={page > 1 ? "ไม่มีรายการในหน้านี้" : "ยังไม่มีผลการแข่งขัน"} />
          ) : (
            <ResultTable
              matches={completed}
              teams={teams}
              completed
              rankPoints={config.rankPoints}
            />
          )}
          <Pager page={page} hasMore={hasMore} hrefFor={(p) => `/admin/results?page=${p}`} />
        </Panel>
      </div>
    </>
  );
}
