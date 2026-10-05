"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sports } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { TAGS } from "@/lib/queries/cache";
import { idSchema, sportSchema } from "@/lib/validations";
import { failure, invalid, invalidate, isAdmin, UNAUTHORIZED } from "./helpers";

export async function saveSport(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isAdmin())) return UNAUTHORIZED;
  const parsed = sportSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const { id, name, icon, isActive } = parsed.data;
  const values = { name, icon: icon ?? null, isActive };

  try {
    if (id) await db.update(sports).set(values).where(eq(sports.id, id));
    else await db.insert(sports).values(values);
  } catch (error) {
    return failure(error);
  }
  invalidate(TAGS.sports);
  return { ok: true, message: "บันทึกกีฬาแล้ว" };
}

export async function deleteSport(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isAdmin())) return UNAUTHORIZED;
  const parsed = idSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  try {
    await db.delete(sports).where(eq(sports.id, parsed.data.id));
  } catch (error) {
    return failure(error, {
      foreignKey: "ลบไม่ได้ เพราะมีการแข่งขันที่ใช้กีฬานี้อยู่ ให้ปิดการใช้งานแทน",
    });
  }
  invalidate(TAGS.sports);
  return { ok: true, message: "ลบกีฬาแล้ว" };
}
