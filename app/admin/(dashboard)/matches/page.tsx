import { Pencil, Plus, Trash2 } from "lucide-react";
import { DeleteDialog, FormDialog } from "@/components/admin/action-form";
import { AdminPageHeader, EmptyRow, Panel } from "@/components/admin/admin-page";
import { MatchForm } from "@/components/admin/match-form";
import { MatchWhat, MatchWhen, MatchWho } from "@/components/admin/match-summary";
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
import { deleteMatch, saveMatch } from "@/lib/actions/matches";
import { todayInBangkok } from "@/lib/date";
import { fetchAllMatches } from "@/lib/queries/matches";
import { fetchSports } from "@/lib/queries/sports";
import { fetchTeams } from "@/lib/queries/teams";

export default async function AdminMatchesPage() {
  const [matches, sports, teams] = await Promise.all([
    fetchAllMatches(),
    fetchSports(),
    fetchTeams(),
  ]);
  const today = todayInBangkok();
  const hasActiveSport = sports.some((sport) => sport.isActive);

  return (
    <>
      <AdminPageHeader
        title="Matches"
        description="สร้างและแก้ไขตารางการแข่งขัน"
        action={
          hasActiveSport && (
            <FormDialog
              action={saveMatch}
              title="สร้างการแข่งขัน"
              trigger={<Button size="lg" />}
              triggerLabel={
                <>
                  <Plus aria-hidden />
                  สร้างการแข่งขัน
                </>
              }
            >
              <MatchForm sports={sports} teams={teams} defaultDate={today} />
            </FormDialog>
          )
        }
      />
      <Panel>
        {!hasActiveSport ? (
          <EmptyRow message="ต้องเพิ่มกีฬาในเมนู Sports ก่อน จึงจะสร้างการแข่งขันได้" />
        ) : matches.length === 0 ? (
          <EmptyRow message="ยังไม่มีการแข่งขัน" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันเวลา</TableHead>
                <TableHead>กีฬา / รอบ</TableHead>
                <TableHead>ทีม</TableHead>
                <TableHead>สถานะ</TableHead>
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
                    <StatusBadge status={match.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <FormDialog
                        action={saveMatch}
                        title="แก้ไขการแข่งขัน"
                        trigger={<Button variant="outline" size="sm" />}
                        triggerLabel={
                          <>
                            <Pencil aria-hidden />
                            แก้ไข
                          </>
                        }
                      >
                        <MatchForm
                          match={match}
                          sports={sports}
                          teams={teams}
                          defaultDate={today}
                        />
                      </FormDialog>
                      <DeleteDialog
                        action={deleteMatch}
                        id={match.id}
                        title="ลบการแข่งขัน"
                        description={`${match.sport.name} ${match.round} — ผลการแข่งขันและคะแนนของการแข่งขันนี้จะถูกลบไปด้วย และคะแนนรวมจะถูกคำนวณใหม่`}
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
        )}
      </Panel>
    </>
  );
}
