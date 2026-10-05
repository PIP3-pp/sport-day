import "server-only";
import { put } from "@vercel/blob";
import { updateTag } from "next/cache";
import type { ZodError } from "zod";
import type { ActionState } from "@/lib/action-state";
import type { CacheTag } from "@/lib/queries/cache";
import { getAdminSession } from "@/lib/require-admin";

export const UNAUTHORIZED: ActionState = {
  ok: false,
  message: "กรุณาเข้าสู่ระบบผู้ดูแลอีกครั้ง",
};

/** Every admin action calls this first; hiding UI is never the only check. */
export async function isAdmin(): Promise<boolean> {
  return (await getAdminSession()) !== null;
}

export function invalid(error: ZodError): ActionState {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return { ok: false, message: "กรุณาตรวจสอบข้อมูลที่กรอก", fieldErrors };
}

export function invalidate(...tags: CacheTag[]) {
  for (const tag of tags) updateTag(tag);
}

function pgErrorCode(error: unknown): string | undefined {
  for (let e: unknown = error; e && typeof e === "object"; e = (e as { cause?: unknown }).cause) {
    const code = (e as { code?: unknown }).code;
    if (typeof code === "string" && /^\d{2}[0-9A-Z]{3}$/.test(code)) return code;
  }
  return undefined;
}

/** Logs the real error server-side and returns a message that is safe to show. */
export function failure(
  error: unknown,
  messages: { unique?: string; foreignKey?: string } = {},
): ActionState {
  const code = pgErrorCode(error);
  if (code === "23505" && messages.unique) return { ok: false, message: messages.unique };
  if (code === "23503" && messages.foreignKey) {
    return { ok: false, message: messages.foreignKey };
  }
  console.error(error);
  return { ok: false, message: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง" };
}

const IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export type UploadResult =
  | { ok: true; url: string | null }
  | { ok: false; message: string };

/** Uploads an optional image field to Vercel Blob. `url` is null when no file was chosen. */
export async function uploadImage(
  value: FormDataEntryValue | null,
  folder: string,
): Promise<UploadResult> {
  if (!(value instanceof File) || value.size === 0) return { ok: true, url: null };
  const extension = IMAGE_TYPES[value.type];
  if (!extension) return { ok: false, message: "รองรับเฉพาะไฟล์ PNG, JPG หรือ WebP" };
  if (value.size > MAX_IMAGE_BYTES) {
    return { ok: false, message: "ไฟล์รูปต้องมีขนาดไม่เกิน 2 MB" };
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      ok: false,
      message: "ยังไม่ได้ตั้งค่าที่เก็บรูปภาพ (BLOB_READ_WRITE_TOKEN)",
    };
  }
  try {
    const blob = await put(`${folder}/image.${extension}`, value, {
      access: "public",
      addRandomSuffix: true,
      contentType: value.type,
    });
    return { ok: true, url: blob.url };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" };
  }
}
