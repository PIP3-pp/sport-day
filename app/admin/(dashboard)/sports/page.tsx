import { Pencil, Plus, Trash2 } from "lucide-react";
import { DeleteDialog, FormDialog } from "@/components/admin/action-form";
import { AdminPageHeader, EmptyRow, Panel } from "@/components/admin/admin-page";
import { SportForm } from "@/components/admin/sport-form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteSport, saveSport } from "@/lib/actions/sports";
import { fetchSports } from "@/lib/queries/sports";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminSportsPage() {
  await requireAdmin();
  const sports = await fetchSports();

  return (
    <>
      <AdminPageHeader
        title="Sports"
        description="ชนิดกีฬาที่ใช้สร้างการแข่งขัน"
        action={
          <FormDialog
            action={saveSport}
            title="เพิ่มกีฬา"
            trigger={<Button size="lg" />}
            triggerLabel={
              <>
                <Plus aria-hidden />
                เพิ่มกีฬา
              </>
            }
          >
            <SportForm />
          </FormDialog>
        }
      />
      <Panel>
        {sports.length === 0 ? (
          <EmptyRow message="ยังไม่มีกีฬา เริ่มจากเพิ่มกีฬาแรก" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>กีฬา</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sports.map((sport) => (
                <TableRow key={sport.id}>
                  <TableCell className="font-medium">
                    <span aria-hidden className="mr-2">
                      {sport.icon}
                    </span>
                    {sport.name}
                  </TableCell>
                  <TableCell>{sport.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <FormDialog
                        action={saveSport}
                        title="แก้ไขกีฬา"
                        trigger={<Button variant="outline" size="sm" />}
                        triggerLabel={
                          <>
                            <Pencil aria-hidden />
                            แก้ไข
                          </>
                        }
                      >
                        <SportForm sport={sport} />
                      </FormDialog>
                      <DeleteDialog
                        action={deleteSport}
                        id={sport.id}
                        title={`ลบกีฬา “${sport.name}”`}
                        description="กีฬาที่มีการแข่งขันหรือตารางซ้อมอยู่แล้วจะลบไม่ได้ ให้ปิดการใช้งานแทน"
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
