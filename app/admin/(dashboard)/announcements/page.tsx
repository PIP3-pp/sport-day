import { Pencil, Plus, Trash2 } from "lucide-react";
import { DeleteDialog, FormDialog } from "@/components/admin/action-form";
import { AdminPageHeader, EmptyRow, Panel } from "@/components/admin/admin-page";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteAnnouncement, saveAnnouncement } from "@/lib/actions/announcements";
import { formatThaiDate, todayInBangkok } from "@/lib/date";
import { fetchAnnouncements } from "@/lib/queries/announcements";

export default async function AdminAnnouncementsPage() {
  const announcements = await fetchAnnouncements();
  const today = todayInBangkok();

  return (
    <>
      <AdminPageHeader
        title="Announcements"
        description="ข่าวสารที่แสดงบนหน้าแรก"
        action={
          <FormDialog
            action={saveAnnouncement}
            title="สร้างประกาศ"
            trigger={<Button size="lg" />}
            triggerLabel={
              <>
                <Plus aria-hidden />
                สร้างประกาศ
              </>
            }
          >
            <AnnouncementForm defaultDate={today} />
          </FormDialog>
        }
      />
      <Panel>
        {announcements.length === 0 ? (
          <EmptyRow message="ยังไม่มีประกาศ" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่ประกาศ</TableHead>
                <TableHead>หัวข้อ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatThaiDate(item.publishedAt)}
                  </TableCell>
                  <TableCell className="min-w-48 font-medium">{item.title}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {item.isPublished ? "เผยแพร่แล้ว" : "ยังไม่เผยแพร่"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <FormDialog
                        action={saveAnnouncement}
                        title="แก้ไขประกาศ"
                        trigger={<Button variant="outline" size="sm" />}
                        triggerLabel={
                          <>
                            <Pencil aria-hidden />
                            แก้ไข
                          </>
                        }
                      >
                        <AnnouncementForm announcement={item} defaultDate={today} />
                      </FormDialog>
                      <DeleteDialog
                        action={deleteAnnouncement}
                        id={item.id}
                        title="ลบประกาศ"
                        description={`“${item.title}” จะถูกลบถาวร`}
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
