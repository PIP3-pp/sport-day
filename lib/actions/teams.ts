"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teams } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { TAGS } from "@/lib/queries/cache";
import { teamSchema } from "@/lib/validations";
import {
  adminActor,
  audit,
  deleteBlobs,
  failure,
  invalid,
  invalidate,
  UNAUTHORIZED,
  uploadImage,
} from "./helpers";

// Teams are fixed at four (seeded), so there is no create or delete action.
export async function updateTeam(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  const parsed = teamSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const { id, name, slogan, description } = parsed.data;

  const upload = await uploadImage(formData.get("logo"), "teams");
  if (!upload.ok) return { ok: false, fieldErrors: { logo: [upload.message] } };

  const removeLogo = formData.get("removeLogo") === "on" && !upload.url;
  let previousLogo: string | null = null;
  try {
    const [current] = await db
      .select({ logoUrl: teams.logoUrl })
      .from(teams)
      .where(eq(teams.id, id));
    if (!current) {
      await deleteBlobs(upload.url);
      return { ok: false, message: "ไม่พบทีมนี้ กรุณาโหลดหน้าใหม่" };
    }
    previousLogo = current.logoUrl;
    await db
      .update(teams)
      .set({
        name,
        slogan: slogan ?? null,
        description: description ?? null,
        ...(upload.url ? { logoUrl: upload.url } : {}),
        ...(removeLogo ? { logoUrl: null } : {}),
      })
      .where(eq(teams.id, id));
  } catch (error) {
    await deleteBlobs(upload.url);
    return failure(error);
  }
  if (upload.url || removeLogo) await deleteBlobs(previousLogo);
  await audit(actor, "team.update", name);
  invalidate(TAGS.teams);
  return { ok: true, message: "บันทึกข้อมูลทีมแล้ว" };
}
