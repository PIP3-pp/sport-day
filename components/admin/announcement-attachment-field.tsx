"use client";

import { FileText, Image as ImageIcon } from "lucide-react";
import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldErrors } from "./action-form";

export function AttachmentField({
  name,
  currentUrl,
  currentType,
  currentName,
}: {
  name: string;
  currentUrl: string | null;
  currentType: string | null;
  currentName: string | null;
}) {
  const id = useId();
  const errors = useFieldErrors(name);
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>ไฟล์แนบข่าวสาร (ไม่บังคับ)</Label>
      <Input id={id} name={name} type="file" accept="image/png,image/jpeg,image/webp,application/pdf" className="h-10 pt-2" aria-invalid={errors ? true : undefined} />
      <p className="text-xs text-muted-foreground">รองรับรูป PNG, JPG, WebP หรือ PDF ขนาดไม่เกิน 5 MB หากเลือกไฟล์ใหม่จะแทนที่ไฟล์เดิม</p>
      {errors && <p role="alert" className="text-sm text-destructive">{errors.join(" ")}</p>}
      {currentUrl && (
        <div className="flex items-center gap-2 rounded-md border p-3 text-sm">
          {currentType === "pdf" ? <FileText aria-hidden className="size-4 shrink-0" /> : <ImageIcon aria-hidden className="size-4 shrink-0" />}
          <a href={currentUrl} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate underline">ไฟล์ปัจจุบัน: {currentName ?? (currentType === "pdf" ? "เอกสาร PDF" : "รูปภาพ")}</a>
          <label className="flex shrink-0 items-center gap-2 text-xs"><input type="checkbox" name="removeAttachment" /> ลบไฟล์</label>
        </div>
      )}
    </div>
  );
}
