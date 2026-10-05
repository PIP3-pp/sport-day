import { ClipboardPen, Pencil, Trash2 } from "lucide-react";
import { DeleteDialog, FormDialog } from "@/components/admin/action-form";
import { AdminPageHeader, EmptyRow, Panel } from "@/components/admin/admin-page";
import { MatchWhat, MatchWhen, MatchWho } from "@/components/admin/match-summary";
import { ResultForm } from "@/components/admin/result-form";
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
import { fetchAllMatches, type MatchView } from "@/lib/queries/matches";
import { fetchTeams, type TeamRef } from "@/lib/queries/teams";

function ResultTable({
  matches,
  teams,
  completed,
}: {
  matches: MatchView[];
  teams: TeamRef[];
  completed: boolean;
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
            </TableCell>
            <TableCell>
              <MatchWho match={match} />
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
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
                  <ResultForm match={match} teams={teams} />
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

export default async function AdminResultsPage() {
  const [matches, teams] = await Promise.all([fetchAllMatches(), fetchTeams()]);
  // Oldest first: the next result to enter is at the top.
  const pending = matches.filter((m) => m.status === "scheduled").reverse();
  const completed = matches.filter((m) => m.status === "completed");

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
            <ResultTable matches={pending} teams={teams} completed={false} />
          )}
        </Panel>
        <Panel title={`บันทึกผลแล้ว (${completed.length})`}>
          {completed.length === 0 ? (
            <EmptyRow message="ยังไม่มีผลการแข่งขัน" />
          ) : (
            <ResultTable matches={completed} teams={teams} completed />
          )}
        </Panel>
      </div>
    </>
  );
}
