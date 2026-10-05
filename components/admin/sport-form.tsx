"use client";

import type { Sport } from "@/lib/queries/sports";
import { CheckboxField, TextField } from "./fields";

export function SportForm({ sport }: { sport?: Sport }) {
  return (
    <>
      {sport && <input type="hidden" name="id" value={sport.id} />}
      <TextField name="name" label="ชื่อกีฬา" defaultValue={sport?.name} required />
      <TextField
        name="icon"
        label="ไอคอน (อีโมจิ)"
        defaultValue={sport?.icon ?? ""}
        placeholder="⚽"
        hint="ไม่บังคับ ใส่อีโมจิ 1 ตัว"
      />
      <CheckboxField
        name="isActive"
        label="เปิดใช้งาน"
        hint="กีฬาที่ปิดใช้งานจะไม่ให้เลือกตอนสร้างการแข่งขันใหม่"
        defaultChecked={sport?.isActive ?? true}
      />
    </>
  );
}
