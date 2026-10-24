import { desc } from "drizzle-orm";
import { AdminPageHeader, EmptyRow, Panel } from "@/components/admin/admin-page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { auditLog } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";

const LIMIT = 100;

const ACTION_LABELS: Record<string, string> = {
  "match.create": "สร้างการแข่งขัน",
  "match.update": "แก้ไขการแข่งขัน",
  "match.start": "เริ่มการแข่งขัน",
  "match.delete": "ลบการแข่งขัน",
  "result.create": "บันทึกผล",
  "result.update": "แก้ไขผล",
  "result.delete": "ลบผล",
  "team.update": "แก้ไขทีม",
  "sport.create": "เพิ่มกีฬา",
  "sport.update": "แก้ไขกีฬา",
  "sport.delete": "ลบกีฬา",
  "highlight.create": "เพิ่ม Highlight",
  "highlight.update": "แก้ไข Highlight",
  "highlight.delete": "ลบ Highlight",
  "announcement.create": "เพิ่มประกาศ",
  "announcement.update": "แก้ไขประกาศ",
  "announcement.delete": "ลบประกาศ",
  "settings.update": "แก้ไขการตั้งค่า",
};

const formatWhen = (value: string) =>
  new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(value));

export default async function AdminActivityPage() {
  await requireAdmin();
  const rows = await db
    .select()
    .from(auditLog)
    .orderBy(desc(auditLog.at), desc(auditLog.id))
    .limit(LIMIT);

  return (
    <>
      <AdminPageHeader
        title="Activity"
        description={`ประวัติการแก้ไขข้อมูลล่าสุด ${LIMIT} รายการ — ใครทำอะไรเมื่อไร`}
      />
      <Panel>
        {rows.length === 0 ? (
          <EmptyRow message="ยังไม่มีประวัติการแก้ไข" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เวลา</TableHead>
                <TableHead>ผู้ดูแล</TableHead>
                <TableHead>การกระทำ</TableHead>
                <TableHead>รายละเอียด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="whitespace-nowrap tabular-nums">
                    {formatWhen(row.at)}
                  </TableCell>
                  <TableCell>{row.actor}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {ACTION_LABELS[row.action] ?? row.action}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.summary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Panel>
    </>
  );
}
