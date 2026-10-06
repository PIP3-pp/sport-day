"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { matches, results } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { TAGS } from "@/lib/queries/cache";
import { idSchema, matchSchema } from "@/lib/validations";
import { adminActor, audit, failure, invalid, invalidate, UNAUTHORIZED } from "./helpers";

export async function saveMatch(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
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
  await audit(
    actor,
    id ? "match.update" : "match.create",
    `${id ? `#${id} ` : ""}${date} ${startTime} ${round}`,
  );
  invalidate(TAGS.matches);
  return { ok: true, message: "บันทึกการแข่งขันแล้ว" };
}

/** One-tap "kick-off": marks a not-yet-started match as in progress. */
export async function startMatch(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  const parsed = idSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  try {
    await db
      .update(matches)
      .set({ status: "in_progress" })
      .where(and(eq(matches.id, parsed.data.id), eq(matches.status, "scheduled")));
  } catch (error) {
    return failure(error);
  }
  await audit(actor, "match.start", `#${parsed.data.id}`);
  invalidate(TAGS.matches);
  return { ok: true, message: "เริ่มการแข่งขันแล้ว" };
}

export async function deleteMatch(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  const parsed = idSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  try {
    // Results and score points cascade; a linked highlight keeps its text.
    await db.delete(matches).where(eq(matches.id, parsed.data.id));
  } catch (error) {
    return failure(error);
  }
  await audit(actor, "match.delete", `#${parsed.data.id}`);
  invalidate(TAGS.matches, TAGS.highlights);
  return { ok: true, message: "ลบการแข่งขันแล้ว" };
}
