"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { TAGS } from "@/lib/queries/cache";
import { announcementSchema, idSchema } from "@/lib/validations";
import {
  adminActor,
  audit,
  deleteBlobs,
  failure,
  invalid,
  invalidate,
  UNAUTHORIZED,
  uploadAnnouncementAttachment,
} from "./helpers";

export async function saveAnnouncement(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  const parsed = announcementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const { id, ...values } = parsed.data;

  const upload = await uploadAnnouncementAttachment(formData.get("attachment"));
  if (!upload.ok) return { ok: false, fieldErrors: { attachment: [upload.message] } };
  const removeAttachment = formData.get("removeAttachment") === "on" && !upload.url;
  const attachmentValues = {
    ...(upload.url ? { attachmentUrl: upload.url, attachmentType: upload.type, attachmentName: upload.name } : {}),
    ...(removeAttachment ? { attachmentUrl: null, attachmentType: null, attachmentName: null } : {}),
  };

  let previousAttachment: string | null = null;
  try {
    if (id && (upload.url || removeAttachment)) {
      const [current] = await db.select({ attachmentUrl: announcements.attachmentUrl })
        .from(announcements).where(eq(announcements.id, id));
      previousAttachment = current?.attachmentUrl ?? null;
    }
    if (id) await db.update(announcements).set({ ...values, ...attachmentValues }).where(eq(announcements.id, id));
    else await db.insert(announcements).values({ ...values, ...attachmentValues });
  } catch (error) {
    await deleteBlobs(upload.url);
    return failure(error);
  }
  if (upload.url || removeAttachment) await deleteBlobs(previousAttachment);
  await audit(actor, id ? "announcement.update" : "announcement.create", values.title);
  invalidate(TAGS.announcements);
  return { ok: true, message: "บันทึกประกาศแล้ว" };
}

export async function deleteAnnouncement(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  const parsed = idSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  let removed: { attachmentUrl: string | null }[];
  try {
    removed = await db.delete(announcements).where(eq(announcements.id, parsed.data.id))
      .returning({ attachmentUrl: announcements.attachmentUrl });
  } catch (error) {
    return failure(error);
  }
  await deleteBlobs(...removed.map((row) => row.attachmentUrl));
  await audit(actor, "announcement.delete", `#${parsed.data.id}`);
  invalidate(TAGS.announcements);
  return { ok: true, message: "ลบประกาศแล้ว" };
}
