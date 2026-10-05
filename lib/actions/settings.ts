"use server";

import { db } from "@/db";
import { siteConfig } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { TAGS } from "@/lib/queries/cache";
import { settingsSchema } from "@/lib/validations";
import {
  failure,
  invalid,
  invalidate,
  isAdmin,
  UNAUTHORIZED,
  uploadImage,
} from "./helpers";

export async function saveSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isAdmin())) return UNAUTHORIZED;
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const { eventName, eventYear, slogan, galleryDriveUrl } = parsed.data;

  const upload = await uploadImage(formData.get("schoolLogo"), "site");
  if (!upload.ok) return { ok: false, fieldErrors: { schoolLogo: [upload.message] } };

  const values = {
    eventName,
    eventYear,
    slogan: slogan ?? "",
    galleryDriveUrl: galleryDriveUrl ?? null,
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
  invalidate(TAGS.config);
  return { ok: true, message: "บันทึกการตั้งค่าแล้ว" };
}
