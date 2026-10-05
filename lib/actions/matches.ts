"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { matches, results } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { TAGS } from "@/lib/queries/cache";
import { idSchema, matchSchema } from "@/lib/validations";
import { failure, invalid, invalidate, isAdmin, UNAUTHORIZED } from "./helpers";

export async function saveMatch(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isAdmin())) return UNAUTHORIZED;
  const parsed = matchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const { id, sportId, date, startTime, round, format, teamAId, teamBId, status } =
    parsed.data;

  const schedule = { sportId: sportId!, date, startTime, round };
  const participants = {
    format,
    teamAId: format === "versus" ? teamAId! : null,
    teamBId: format === "versus" ? teamBId! : null,
    status,
  };

  try {
    if (!id) {
      await db.insert(matches).values({ ...schedule, ...participants });
    } else {
      const [hasResult] = await db
        .select({ id: results.id })
        .from(results)
        .where(eq(results.matchId, id))
        .limit(1);
      // Once a result exists, teams/format/status are locked so the stored
      // result can never disagree with the match. Delete the result to change them.
      await db
        .update(matches)
        .set(hasResult ? schedule : { ...schedule, ...participants })
        .where(eq(matches.id, id));
    }
  } catch (error) {
    return failure(error, { foreignKey: "กีฬาหรือทีมที่เลือกไม่มีอยู่ในระบบ" });
  }
  invalidate(TAGS.matches);
  return { ok: true, message: "บันทึกการแข่งขันแล้ว" };
}

export async function deleteMatch(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isAdmin())) return UNAUTHORIZED;
  const parsed = idSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  try {
    // Results and score points cascade; a linked highlight keeps its text.
    await db.delete(matches).where(eq(matches.id, parsed.data.id));
  } catch (error) {
    return failure(error);
  }
  invalidate(TAGS.matches, TAGS.highlights);
  return { ok: true, message: "ลบการแข่งขันแล้ว" };
}
