import "server-only";
import { del, put } from "@vercel/blob";
import { updateTag } from "next/cache";
import type { ZodError } from "zod";
import { db } from "@/db";
import { auditLog } from "@/db/schema";
import { detectImageType } from "@/lib/image-type";
import type { ActionState } from "@/lib/action-state";
import type { CacheTag } from "@/lib/queries/cache";
import { getAdminSession } from "@/lib/require-admin";

export const UNAUTHORIZED: ActionState = {
  ok: false,
  message: "กรุณาเข้าสู่ระบบผู้ดูแลอีกครั้ง",
};

/** Every admin action calls this first; hiding UI is never the only check. Returns the admin's email. */
export async function adminActor(): Promise<string | null> {
  return (await getAdminSession())?.user.email ?? null;
}

/** Records who did what. A failure to log is reported but never fails the action. */
export async function audit(actor: string, action: string, summary: string) {
  try {
    await db.insert(auditLog).values({ actor, action, summary });
  } catch (error) {
    console.error("Failed to write audit log", error);
  }
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
  if (value.size > MAX_IMAGE_BYTES) {
    return { ok: false, message: "ไฟล์รูปต้องมีขนาดไม่เกิน 2 MB" };
  }
  // The browser-supplied MIME type is only a hint; trust the file's own signature.
  const type = detectImageType(new Uint8Array(await value.slice(0, 12).arrayBuffer()));
  const extension = type && IMAGE_TYPES[type];
  if (!type || !extension) return { ok: false, message: "รองรับเฉพาะไฟล์ PNG, JPG หรือ WebP" };
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
      contentType: type,
    });
    return { ok: true, url: blob.url };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" };
  }
}

const MAX_ANNOUNCEMENT_ATTACHMENT_BYTES = 5 * 1024 * 1024;

export type AnnouncementAttachmentResult =
  | { ok: true; url: string | null; type: "image" | "pdf" | null; name: string | null }
  | { ok: false; message: string };

/** Uploads an announcement image or PDF to Vercel Blob after checking its signature. */
export async function uploadAnnouncementAttachment(
  value: FormDataEntryValue | null,
): Promise<AnnouncementAttachmentResult> {
  if (!(value instanceof File) || value.size === 0) {
    return { ok: true, url: null, type: null, name: null };
  }
  if (value.size > MAX_ANNOUNCEMENT_ATTACHMENT_BYTES) {
    return { ok: false, message: "ไฟล์แนบต้องมีขนาดไม่เกิน 5 MB" };
  }

  const header = new Uint8Array(await value.slice(0, 12).arrayBuffer());
  const imageType = detectImageType(header);
  const imageExtensions: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
  };
  const isPdf = header.length >= 5 && String.fromCharCode(...header.slice(0, 5)) === "%PDF-";
  const type = imageType && imageExtensions[imageType] ? "image" : isPdf ? "pdf" : null;
  if (!type) return { ok: false, message: "รองรับเฉพาะรูป PNG, JPG, WebP หรือไฟล์ PDF" };
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, message: "ยังไม่ได้ตั้งค่าที่เก็บไฟล์ (BLOB_READ_WRITE_TOKEN)" };
  }

  const extension = type === "pdf" ? "pdf" : imageExtensions[imageType!];
  const contentType = type === "pdf" ? "application/pdf" : imageType!;
  try {
    const blob = await put(`announcements/attachment.${extension}`, value, {
      access: "public",
      addRandomSuffix: true,
      contentType,
    });
    return { ok: true, url: blob.url, type, name: value.name.slice(0, 255) || `attachment.${extension}` };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" };
  }
}

const isBlobUrl = (value: string) => {
  try {
    return new URL(value).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
};

/**
 * Removes uploaded files that nothing references any more (a replaced logo, or an
 * upload whose save failed). Bundled files such as /banner.webp are skipped.
 * A failure is logged but never fails the action.
 */
export async function deleteBlobs(...urls: (string | null | undefined)[]) {
  const targets = urls.filter((url): url is string => !!url && isBlobUrl(url));
  if (targets.length === 0 || !process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    await del(targets);
  } catch (error) {
    console.error("Failed to delete unused files", error);
  }
}
