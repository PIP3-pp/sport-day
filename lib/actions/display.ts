"use server";

import { head } from "@vercel/blob";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { siteConfig } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { isAllowedBannerUrl } from "@/lib/banner";
import { TAGS } from "@/lib/queries/cache";
import { isSectionKey, SECTIONS } from "@/lib/visibility";
import { adminActor, audit, deleteBlobs, failure, invalidate, UNAUTHORIZED } from "./helpers";

/**
 * A supported file that really is in this project's Blob store: `head` uses our
 * own token, so a file in any other store (or one that doesn't exist) is rejected.
 */
async function isOwnBannerFile(url: string): Promise<boolean> {
  if (!isAllowedBannerUrl(url) || !process.env.BLOB_READ_WRITE_TOKEN) return false;
  try {
    await head(url);
    return true;
  } catch {
    return false;
  }
}

const NO_CONFIG: ActionState = {
  ok: false,
  message: "ยังไม่มีข้อมูลงาน กรุณาบันทึกหน้า Settings ก่อน",
};

/** Shows or hides one public section or page. */
export async function setSectionVisibility(key: string, visible: boolean): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  if (!isSectionKey(key) || typeof visible !== "boolean") {
    return { ok: false, message: "ข้อมูลไม่ถูกต้อง" };
  }

  try {
    // Sets one key in place, so two admins toggling different switches don't overwrite each other.
    const updated = await db
      .update(siteConfig)
      .set({
        visibility: sql`jsonb_set(coalesce(${siteConfig.visibility}, '{}'::jsonb), ${`{${key}}`}::text[], ${JSON.stringify(visible)}::jsonb)`,
      })
      .where(eq(siteConfig.id, 1))
      .returning({ id: siteConfig.id });
    if (updated.length === 0) return NO_CONFIG;
  } catch (error) {
    return failure(error);
  }
  const label = SECTIONS.find((s) => s.key === key)!.label;
  await audit(actor, "display.toggle", `${visible ? "เปิด" : "ปิด"} ${label}`);
  invalidate(TAGS.config);
  return { ok: true, message: `${visible ? "เปิด" : "ปิด"}การแสดง “${label}” แล้ว` };
}

/** Sets the home page cover to an uploaded file, or back to the default with null. */
export async function setBanner(url: string | null): Promise<ActionState> {
  const actor = await adminActor();
  if (!actor) return UNAUTHORIZED;
  if (url !== null && (typeof url !== "string" || !(await isOwnBannerFile(url)))) {
    return { ok: false, message: "ไฟล์รูปปกไม่ถูกต้อง" };
  }

  let previous: string | null = null;
  try {
    const [current] = await db
      .select({ bannerUrl: siteConfig.bannerUrl })
      .from(siteConfig)
      .where(eq(siteConfig.id, 1));
    if (!current) {
      await deleteBlobs(url);
      return NO_CONFIG;
    }
    previous = current.bannerUrl;
    await db.update(siteConfig).set({ bannerUrl: url }).where(eq(siteConfig.id, 1));
  } catch (error) {
    await deleteBlobs(url);
    return failure(error);
  }
  if (previous !== url) await deleteBlobs(previous);
  await audit(actor, "display.banner", url ? "เปลี่ยนรูปปก" : "ใช้รูปปกเริ่มต้น");
  invalidate(TAGS.config);
  return { ok: true, message: url ? "เปลี่ยนรูปปกแล้ว" : "กลับไปใช้รูปปกเริ่มต้นแล้ว" };
}
