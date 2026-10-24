"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteConfig } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { TAGS } from "@/lib/queries/cache";
import { settingsSchema } from "@/lib/validations";
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

export async function saveSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const { eventName, eventYear, slogan, galleryDriveUrl, rankPoints } = parsed.data;

  const upload = await uploadImage(formData.get("schoolLogo"), "site");
  if (!upload.ok) return { ok: false, fieldErrors: { schoolLogo: [upload.message] } };

  const removeLogo = formData.get("removeSchoolLogo") === "on" && !upload.url;
  const values = {
    eventName,
    eventYear,
    slogan: slogan ?? "",
    galleryDriveUrl: galleryDriveUrl ?? null,
    rankPoints: rankPoints?.replace(/\s+/g, "") ?? null,
    ...(upload.url ? { schoolLogoUrl: upload.url } : {}),
    ...(removeLogo ? { schoolLogoUrl: null } : {}),
  };

  let previousLogo: string | null = null;
  try {
    const [current] = await db
      .select({ schoolLogoUrl: siteConfig.schoolLogoUrl })
      .from(siteConfig)
      .where(eq(siteConfig.id, 1));
    previousLogo = current?.schoolLogoUrl ?? null;
    await db
      .insert(siteConfig)
      .values({ id: 1, ...values })
      .onConflictDoUpdate({ target: siteConfig.id, set: values });
  } catch (error) {
    await deleteBlobs(upload.url);
    return failure(error);
  }
  if (upload.url || removeLogo) await deleteBlobs(previousLogo);
  await audit(actor, "settings.update", `${eventName} ${eventYear}`);
  invalidate(TAGS.config);
  return { ok: true, message: "บันทึกการตั้งค่าแล้ว" };
}
