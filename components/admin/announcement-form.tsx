"use client";

import type { Announcement } from "@/lib/queries/announcements";
import { CheckboxField, TextareaField, TextField } from "./fields";

export function AnnouncementForm({
  announcement,
  defaultDate,
}: {
  announcement?: Announcement;
  defaultDate: string;
}) {
  return (
    <>
      {announcement && <input type="hidden" name="id" value={announcement.id} />}
      <TextField name="title" label="หัวข้อประกาศ" defaultValue={announcement?.title} />
      <TextareaField
        name="content"
        label="เนื้อหา"
        rows={6}
        defaultValue={announcement?.content}
      />
      <TextField
        name="publishedAt"
        label="วันที่ประกาศ"
        type="date"
        defaultValue={announcement?.publishedAt ?? defaultDate}
      />
      <CheckboxField
        name="isPublished"
        label="เผยแพร่"
        hint="ประกาศที่ยังไม่เผยแพร่จะไม่แสดงบนหน้าเว็บ"
        defaultChecked={announcement?.isPublished ?? true}
      />
    </>
  );
}
