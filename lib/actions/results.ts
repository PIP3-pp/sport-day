"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { matches, results, scorePoints, teams } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { TAGS } from "@/lib/queries/cache";
import { idSchema } from "@/lib/validations";
import { parseResultLines } from "@/lib/validations/result";
import { adminActor, audit, failure, invalid, invalidate, UNAUTHORIZED } from "./helpers";

const DUPLICATE = "การแข่งขันนี้บันทึกผลไปแล้ว หากต้องการเปลี่ยนให้ใช้ “แก้ไขผล”";

/**
 * Saves the final result of a match in one transaction:
 * result rows + score points + match status "completed".
 * `mode=edit` replaces an existing result; otherwise a second submission is rejected.
 */
export async function saveResult(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsedId = idSchema.safeParse({ id: raw.matchId });
  if (!parsedId.success) return { ok: false, message: "ไม่พบการแข่งขัน" };
  const matchId = parsedId.data.id;
  const isEdit = raw.mode === "edit";

  try {
    const [match] = await db
      .select({
        format: matches.format,
        status: matches.status,
        teamAId: matches.teamAId,
        teamBId: matches.teamBId,
      })
      .from(matches)
      .where(eq(matches.id, matchId));
    if (!match) return { ok: false, message: "ไม่พบการแข่งขัน" };
    if (match.status === "cancelled" || match.status === "postponed") {
      return { ok: false, message: "การแข่งขันที่เลื่อนหรือยกเลิกไม่สามารถบันทึกผลได้" };
    }

    // Participants come from the database, never from the submitted form.
    const teamIds =
      match.format === "versus"
        ? [match.teamAId!, match.teamBId!]
        : (await db.select({ id: teams.id }).from(teams).orderBy(asc(teams.id))).map(
            (team) => team.id,
          );

    const parsed = parseResultLines(match.format, teamIds, raw);
    if (!parsed.ok) {
      return {
        ok: false,
        message: "กรุณาตรวจสอบข้อมูลที่กรอก",
        fieldErrors: parsed.fieldErrors,
      };
    }

    const duplicate = await db.transaction(async (tx) => {
      const existing = await tx
        .select({ id: results.id })
        .from(results)
        .where(eq(results.matchId, matchId))
        .limit(1);
      if (existing.length > 0) {
        if (!isEdit) return true;
        await tx.delete(results).where(eq(results.matchId, matchId));
        await tx.delete(scorePoints).where(eq(scorePoints.matchId, matchId));
      }
      await tx.insert(results).values(
        parsed.lines.map((line) => ({
          matchId,
          teamId: line.teamId,
          score: line.score,
          position: line.position,
        })),
      );
      await tx.insert(scorePoints).values(
        parsed.lines.map((line) => ({
          matchId,
          teamId: line.teamId,
          points: line.points,
        })),
      );
      await tx.update(matches).set({ status: "completed" }).where(eq(matches.id, matchId));
      return false;
    });
    if (duplicate) return { ok: false, message: DUPLICATE };
  } catch (error) {
    // The unique index catches two admins submitting at the same moment.
    return failure(error, { unique: DUPLICATE });
  }

  await audit(actor, isEdit ? "result.update" : "result.create", `match #${matchId}`);
  invalidate(TAGS.matches);
  return { ok: true, message: "บันทึกผลการแข่งขันแล้ว" };
}

/** Removes a result entered by mistake and returns the match to "scheduled". */
export async function deleteResult(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  const parsed = idSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const matchId = parsed.data.id;

  try {
    await db.transaction(async (tx) => {
      await tx.delete(results).where(eq(results.matchId, matchId));
      await tx.delete(scorePoints).where(eq(scorePoints.matchId, matchId));
      await tx.update(matches).set({ status: "scheduled" }).where(eq(matches.id, matchId));
    });
  } catch (error) {
    return failure(error);
  }
  await audit(actor, "result.delete", `match #${matchId}`);
  invalidate(TAGS.matches);
  return { ok: true, message: "ลบผลการแข่งขันแล้ว" };
}
