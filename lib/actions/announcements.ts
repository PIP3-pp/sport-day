"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { TAGS } from "@/lib/queries/cache";
import { announcementSchema, idSchema } from "@/lib/validations";
import { failure, invalid, invalidate, isAdmin, UNAUTHORIZED } from "./helpers";

export async function saveAnnouncement(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isAdmin())) return UNAUTHORIZED;
  const parsed = announcementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const { id, ...values } = parsed.data;

  try {
    if (id) await db.update(announcements).set(values).where(eq(announcements.id, id));
    else await db.insert(announcements).values(values);
  } catch (error) {
    return failure(error);
  }
  invalidate(TAGS.announcements);
  return { ok: true, message: "บันทึกประกาศแล้ว" };
}

export async function deleteAnnouncement(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isAdmin())) return UNAUTHORIZED;
  const parsed = idSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  try {
    await db.delete(announcements).where(eq(announcements.id, parsed.data.id));
  } catch (error) {
    return failure(error);
  }
  invalidate(TAGS.announcements);
  return { ok: true, message: "ลบประกาศแล้ว" };
}
