import { Pencil, Plus, Trash2 } from "lucide-react";
import { DeleteDialog, FormDialog } from "@/components/admin/action-form";
import { AdminPageHeader, EmptyRow, Panel } from "@/components/admin/admin-page";
import { HighlightForm } from "@/components/admin/highlight-form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteHighlight, saveHighlight } from "@/lib/actions/highlights";
import { formatThaiDate, todayInBangkok } from "@/lib/date";
import { fetchHighlights } from "@/lib/queries/highlights";
import { fetchAllMatches } from "@/lib/queries/matches";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminHighlightsPage() {
  await requireAdmin();
  const [highlights, matches] = await Promise.all([fetchHighlights(), fetchAllMatches()]);
  const today = todayInBangkok();

  return (
    <>
      <AdminPageHeader
        title="Highlights"
        description="Highlight of the Day ที่แสดงบนหน้าแรก วันละ 1 รายการ"
        action={
          <FormDialog
            action={saveHighlight}
            title="สร้าง Highlight"
            trigger={<Button size="lg" />}
            triggerLabel={
              <>
                <Plus aria-hidden />
                สร้าง Highlight
              </>
            }
          >
            <HighlightForm matches={matches} defaultDate={today} />
          </FormDialog>
        }
      />
      <Panel>
        {highlights.length === 0 ? (
          <EmptyRow message="ยังไม่มี Highlight" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่</TableHead>
                <TableHead>หัวข้อ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {highlights.map((highlight) => (
                <TableRow key={highlight.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatThaiDate(highlight.date)}
                  </TableCell>
                  <TableCell className="min-w-48 font-medium">{highlight.title}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {highlight.isActive ? "แสดงอยู่" : "ปิดอยู่"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <FormDialog
                        action={saveHighlight}
                        title="แก้ไข Highlight"
                        trigger={<Button variant="outline" size="sm" />}
                        triggerLabel={
                          <>
                            <Pencil aria-hidden />
                            แก้ไข
                          </>
                        }
                      >
                        <HighlightForm
                          highlight={highlight}
                          matches={matches}
                          defaultDate={today}
                        />
                      </FormDialog>
                      <DeleteDialog
                        action={deleteHighlight}
                        id={highlight.id}
                        title="ลบ Highlight"
                        description={`“${highlight.title}” จะถูกลบถาวร`}
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
