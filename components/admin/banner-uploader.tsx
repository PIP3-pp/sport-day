"use client";

import { upload } from "@vercel/blob/client";
import { ImageUp, Loader2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setBanner } from "@/lib/actions/display";
import {
  BANNER_ACCEPT,
  BANNER_MAX_BYTES,
  BANNER_TYPES,
  bannerKind,
  DEFAULT_BANNER_URL,
  fileExtension,
} from "@/lib/banner";

/** Preview of the current cover plus upload / reset controls. */
export function BannerUploader({ currentUrl }: { currentUrl: string | null }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const busy = progress !== null || pending;
  const src = currentUrl ?? DEFAULT_BANNER_URL;

  async function onFile(file: File) {
    const ext = fileExtension(file.name);
    const type = BANNER_TYPES[ext];
    if (!type) {
      toast.error("รองรับเฉพาะไฟล์ PNG, JPEG, GIF, WebP, MOV หรือ MP4");
      return;
    }
    if (file.size > BANNER_MAX_BYTES) {
      toast.error(`ไฟล์ต้องมีขนาดไม่เกิน ${BANNER_MAX_BYTES / 1024 / 1024} MB`);
      return;
    }

    setProgress(0);
    try {
      const blob = await upload(`banner/cover.${ext}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/banner-upload",
        contentType: type.contentType,
        multipart: file.size > 8 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      setProgress(null);
      save(blob.url);
    } catch (error) {
      console.error(error);
      setProgress(null);
      toast.error("อัปโหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  }

  function save(url: string | null) {
    startTransition(async () => {
      const result = await setBanner(url);
      if (result.ok) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message ?? "บันทึกไม่สำเร็จ");
      }
    });
  }

  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-md border bg-muted">
        {bannerKind(src) === "video" ? (
          <video
            key={src}
            src={src}
            muted
            loop
            autoPlay
            playsInline
            className="max-h-72 w-full object-cover"
          />
        ) : (
          // Plain <img>: a preview of any format (e.g. GIF) without the optimizer.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="รูปปกปัจจุบัน" className="max-h-72 w-full object-cover" />
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {currentUrl ? "ใช้รูปปกที่อัปโหลด" : "ใช้รูปปกเริ่มต้น"} · รองรับ PNG, JPEG, GIF,
        WebP, MOV และ MP4 ขนาดไม่เกิน {BANNER_MAX_BYTES / 1024 / 1024} MB · วิดีโอจะเล่นวนแบบปิดเสียง
        (แนะนำ MP4 เพื่อให้เล่นได้ทุกเบราว์เซอร์)
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={BANNER_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void onFile(file);
        }}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {currentUrl && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={busy}
            onClick={() => save(null)}
          >
            <RotateCcw aria-hidden />
            ใช้รูปปกเริ่มต้น
          </Button>
        )}
        <Button type="button" size="lg" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? <Loader2 aria-hidden className="animate-spin" /> : <ImageUp aria-hidden />}
          {progress !== null ? `กำลังอัปโหลด ${progress}%` : "เปลี่ยนรูปปก"}
        </Button>
      </div>
    </div>
  );
}
