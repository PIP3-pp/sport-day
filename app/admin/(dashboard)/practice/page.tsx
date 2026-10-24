import { Pencil, Plus, Trash2 } from "lucide-react";
import { DeleteDialog, FormDialog } from "@/components/admin/action-form";
import { AdminPageHeader, EmptyRow, Panel } from "@/components/admin/admin-page";
import { PracticeForm } from "@/components/admin/practice-form";
import { TeamBadge } from "@/components/shared/team-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deletePractice, savePractice } from "@/lib/actions/practice";
import { formatTime } from "@/lib/date";
import { fetchPracticeSessions, groupBySport } from "@/lib/queries/practice";
import { fetchSports } from "@/lib/queries/sports";
import { fetchTeams } from "@/lib/queries/teams";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminPracticePage() {
  await requireAdmin();
  const [sessions, sports, teams] = await Promise.all([
    fetchPracticeSessions(),
    fetchSports(),
    fetchTeams(),
  ]);
  const groups = groupBySport(sessions);

  return (
    <>
      <AdminPageHeader
        title="ตารางซ้อม"
        description="วัน เวลา และสถานที่ซ้อมของแต่ละสี แยกตามกีฬา"
        action={
          <FormDialog
            action={savePractice}
            title="เพิ่มตารางซ้อม"
            trigger={<Button size="lg" disabled={sports.length === 0} />}
            triggerLabel={
              <>
                <Plus aria-hidden />
                เพิ่มตารางซ้อม
              </>
            }
          >
            <PracticeForm sports={sports} teams={teams} />
          </FormDialog>
        }
      />
      {groups.length === 0 ? (
        <Panel>
          <EmptyRow
            message={
              sports.length === 0
                ? "ยังไม่มีกีฬา เพิ่มกีฬาในหน้า Sports ก่อน"
                : "ยังไม่มีตารางซ้อม เริ่มจากเพิ่มรายการแรก"
            }
          />
        </Panel>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <Panel
              key={group.sport.id}
              title={`${group.sport.icon ?? ""} ${group.sport.name}`.trim()}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>สี</TableHead>
                    <TableHead>วัน</TableHead>
                    <TableHead>เวลา</TableHead>
                    <TableHead>สถานที่</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        <TeamBadge team={session.team} />
                      </TableCell>
                      <TableCell>{session.days}</TableCell>
                      <TableCell className="tabular-nums">
                        {formatTime(session.startTime)}–{formatTime(session.endTime)}
                      </TableCell>
                      <TableCell>
                        {session.location}
                        {session.note && (
                          <span className="block text-xs text-muted-foreground">
                            {session.note}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <FormDialog
                            action={savePractice}
                            title="แก้ไขตารางซ้อม"
                            trigger={<Button variant="outline" size="sm" />}
                            triggerLabel={
                              <>
                                <Pencil aria-hidden />
                                แก้ไข
                              </>
                            }
                          >
                            <PracticeForm practice={session} sports={sports} teams={teams} />
                          </FormDialog>
                          <DeleteDialog
                            action={deletePractice}
                            id={session.id}
                            title="ลบตารางซ้อม"
                            description={`${group.sport.name} · ${session.team.name} · ${session.days} ${formatTime(session.startTime)}–${formatTime(session.endTime)}`}
                            triggerLabel={
                              <>
                                <Trash2 aria-hidden />
                                ลบ
                              </>
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
