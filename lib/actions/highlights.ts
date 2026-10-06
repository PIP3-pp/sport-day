"use server";

import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { highlights } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { TAGS } from "@/lib/queries/cache";
import { highlightSchema, idSchema } from "@/lib/validations";
import {
  adminActor,
  audit,
  failure,
  invalid,
  invalidate,
  UNAUTHORIZED,
  uploadImage,
} from "./helpers";

export async function saveHighlight(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  const parsed = highlightSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const { id, date, title, description, matchId, isActive } = parsed.data;

  const upload = await uploadImage(formData.get("image"), "highlights");
  if (!upload.ok) return { ok: false, fieldErrors: { image: [upload.message] } };

  const values = {
    date,
    title,
    description: description ?? null,
    matchId: matchId ?? null,
    isActive,
    ...(upload.url ? { imageUrl: upload.url } : {}),
    ...(formData.get("removeImage") === "on" && !upload.url ? { imageUrl: null } : {}),
  };

  try {
    await db.transaction(async (tx) => {
      // Activating a highlight deactivates any other one on the same date.
      if (isActive) {
        await tx
          .update(highlights)
          .set({ isActive: false })
          .where(
            and(
              eq(highlights.date, date),
              eq(highlights.isActive, true),
              id ? ne(highlights.id, id) : undefined,
            ),
          );
      }
      if (id) await tx.update(highlights).set(values).where(eq(highlights.id, id));
      else await tx.insert(highlights).values(values);
    });
  } catch (error) {
    return failure(error, {
      unique: "วันนี้มี Highlight ที่เปิดใช้งานอยู่แล้ว กรุณาลองใหม่อีกครั้ง",
      foreignKey: "ไม่พบการแข่งขันที่เลือก",
    });
  }
  await audit(actor, id ? "highlight.update" : "highlight.create", `${date} ${title}`);
  invalidate(TAGS.highlights);
  return { ok: true, message: "บันทึก Highlight แล้ว" };
}

export async function deleteHighlight(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  const parsed = idSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  try {
    await db.delete(highlights).where(eq(highlights.id, parsed.data.id));
  } catch (error) {
    return failure(error);
  }
  await audit(actor, "highlight.delete", `#${parsed.data.id}`);
  invalidate(TAGS.highlights);
  return { ok: true, message: "ลบ Highlight แล้ว" };
}
