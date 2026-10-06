"use server";

import { db } from "@/db";
import { siteConfig } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { TAGS } from "@/lib/queries/cache";
import { settingsSchema } from "@/lib/validations";
import {
  adminActor,
  audit,
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

  const values = {
    eventName,
    eventYear,
    slogan: slogan ?? "",
    galleryDriveUrl: galleryDriveUrl ?? null,
    rankPoints: rankPoints?.replace(/\s+/g, "") ?? null,
    ...(upload.url ? { schoolLogoUrl: upload.url } : {}),
    ...(formData.get("removeSchoolLogo") === "on" && !upload.url
      ? { schoolLogoUrl: null }
      : {}),
  };

  try {
    await db
      .insert(siteConfig)
      .values({ id: 1, ...values })
      .onConflictDoUpdate({ target: siteConfig.id, set: values });
  } catch (error) {
    return failure(error);
  }
  await audit(actor, "settings.update", `${eventName} ${eventYear}`);
  invalidate(TAGS.config);
  return { ok: true, message: "บันทึกการตั้งค่าแล้ว" };
}
