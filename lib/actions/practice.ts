"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { practiceSessions } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { TAGS } from "@/lib/queries/cache";
import { idSchema, practiceSchema } from "@/lib/validations";
import { adminActor, audit, failure, invalid, invalidate, UNAUTHORIZED } from "./helpers";

export async function savePractice(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  const parsed = practiceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const { id, sportId, teamId, days, startTime, endTime, location, note } = parsed.data;
  const values = {
    sportId: sportId!,
    teamId: teamId!,
    days,
    startTime,
    endTime,
    location,
    note: note ?? null,
  };

  try {
    if (id) await db.update(practiceSessions).set(values).where(eq(practiceSessions.id, id));
    else await db.insert(practiceSessions).values(values);
  } catch (error) {
    return failure(error, { foreignKey: "ไม่พบกีฬาหรือสีที่เลือก กรุณาโหลดหน้าใหม่" });
  }
  await audit(
    actor,
    id ? "practice.update" : "practice.create",
    `กีฬา #${values.sportId} สี #${values.teamId} ${days} ${startTime}-${endTime} @ ${location}`,
  );
  invalidate(TAGS.practice);
  return { ok: true, message: "บันทึกตารางซ้อมแล้ว" };
}

export async function deletePractice(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  const parsed = idSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  try {
    await db.delete(practiceSessions).where(eq(practiceSessions.id, parsed.data.id));
  } catch (error) {
    return failure(error);
  }
  await audit(actor, "practice.delete", `#${parsed.data.id}`);
  invalidate(TAGS.practice);
  return { ok: true, message: "ลบตารางซ้อมแล้ว" };
}
