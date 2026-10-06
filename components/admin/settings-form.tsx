"use client";

import { useRouter } from "next/navigation";
import type { SiteConfig } from "@/lib/queries/config";
import { ActionForm, type FormAction } from "./action-form";
import { ImageField, TextField } from "./fields";

export function SettingsForm({
  config,
  action,
}: {
  config: SiteConfig;
  action: FormAction;
}) {
  const router = useRouter();
  return (
    <ActionForm action={action} submitLabel="บันทึกการตั้งค่า" onSuccess={() => router.refresh()}>
      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <TextField name="eventName" label="ชื่องาน" defaultValue={config.eventName} />
        <TextField
          name="eventYear"
          label="ปี"
          type="number"
          inputMode="numeric"
          defaultValue={config.eventYear}
        />
      </div>
      <TextField name="slogan" label="สโลแกน" defaultValue={config.slogan} />
      <TextField
        name="rankPoints"
        label="คะแนนสะสมตามอันดับ (ไม่บังคับ)"
        defaultValue={config.rankPoints.join(",")}
        placeholder="30,20,10,5"
        hint="อันดับ 1,2,3,... คั่นด้วยจุลภาค ใช้เติมช่องคะแนนในหน้าบันทึกผลการแข่งขันแบบจัดอันดับ แก้ไขได้ทุกครั้ง"
      />
      <TextField
        name="galleryDriveUrl"
        label="ลิงก์ Google Drive (Gallery)"
        type="url"
        defaultValue={config.galleryDriveUrl ?? ""}
        placeholder="https://drive.google.com/drive/folders/..."
        hint="ลิงก์โฟลเดอร์รูปที่เปิดแชร์แบบทุกคนที่มีลิงก์ดูได้"
      />
      <ImageField
        name="schoolLogo"
        label="โลโก้โรงเรียน"
        removeName="removeSchoolLogo"
        currentUrl={config.schoolLogoUrl}
      />
    </ActionForm>
  );
}
