"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teams } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { TAGS } from "@/lib/queries/cache";
import { teamSchema } from "@/lib/validations";
import {
  failure,
  invalid,
  invalidate,
  isAdmin,
  UNAUTHORIZED,
  uploadImage,
} from "./helpers";

// Teams are fixed at four (seeded), so there is no create or delete action.
export async function updateTeam(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isAdmin())) return UNAUTHORIZED;
  const parsed = teamSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const { id, name, slogan, description } = parsed.data;

  const upload = await uploadImage(formData.get("logo"), "teams");
  if (!upload.ok) return { ok: false, fieldErrors: { logo: [upload.message] } };

  try {
    await db
      .update(teams)
      .set({
        name,
        slogan: slogan ?? null,
        description: description ?? null,
        ...(upload.url ? { logoUrl: upload.url } : {}),
        ...(formData.get("removeLogo") === "on" && !upload.url ? { logoUrl: null } : {}),
      })
      .where(eq(teams.id, id));
  } catch (error) {
    return failure(error);
  }
  invalidate(TAGS.teams);
  return { ok: true, message: "บันทึกข้อมูลทีมแล้ว" };
}
