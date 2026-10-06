import { z } from "zod";
import { EDITABLE_MATCH_STATUSES, MATCH_FORMATS } from "@/lib/match-constants";
import { isValidDateString } from "@/lib/date";
import { RANK_POINTS_PATTERN } from "@/lib/rank-points";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

const id = z.coerce.number().int().positive();
const optionalId = z.preprocess(emptyToUndefined, id.optional());
const optionalText = (max: number) =>
  z.preprocess(
    emptyToUndefined,
    z.string().trim().max(max, `ยาวได้ไม่เกิน ${max} ตัวอักษร`).optional(),
  );
const requiredText = (label: string, max: number) =>
  z
    .string({ error: `กรุณากรอก${label}` })
    .trim()
    .min(1, `กรุณากรอก${label}`)
    .max(max, `${label}ยาวได้ไม่เกิน ${max} ตัวอักษร`);
const dateString = z
  .string({ error: "กรุณาเลือกวันที่" })
  .refine(isValidDateString, "วันที่ไม่ถูกต้อง");
// HTML checkboxes submit "on" when checked and nothing when unchecked.
const checkbox = z.preprocess((value) => value === "on" || value === true, z.boolean());

export const idSchema = z.object({ id });

export const sportSchema = z.object({
  id: optionalId,
  name: requiredText("ชื่อกีฬา", 60),
  icon: optionalText(8),
  isActive: checkbox,
});

export const teamSchema = z.object({
  id,
  name: requiredText("ชื่อทีม", 40),
  slogan: optionalText(120),
  description: optionalText(1000),
});

export const matchSchema = z
  .object({
    id: optionalId,
    sportId: z.preprocess(emptyToUndefined, id.optional()).refine((v) => v !== undefined, "กรุณาเลือกกีฬา"),
    date: dateString,
    startTime: z
      .string({ error: "กรุณาเลือกเวลา" })
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "เวลาไม่ถูกต้อง"),
    round: requiredText("รอบการแข่งขัน", 100),
    format: z.enum(MATCH_FORMATS, { error: "รูปแบบการแข่งขันไม่ถูกต้อง" }),
    teamAId: optionalId,
    teamBId: optionalId,
    status: z.enum(EDITABLE_MATCH_STATUSES, { error: "สถานะไม่ถูกต้อง" }),
  })
  .superRefine((value, ctx) => {
    if (value.format !== "versus") return;
    if (!value.teamAId) {
      ctx.addIssue({ code: "custom", path: ["teamAId"], message: "กรุณาเลือกทีม A" });
    }
    if (!value.teamBId) {
      ctx.addIssue({ code: "custom", path: ["teamBId"], message: "กรุณาเลือกทีม B" });
    }
    if (value.teamAId && value.teamAId === value.teamBId) {
      ctx.addIssue({
        code: "custom",
        path: ["teamBId"],
        message: "ทีม A และทีม B ต้องไม่ใช่ทีมเดียวกัน",
      });
    }
  });

export const highlightSchema = z.object({
  id: optionalId,
  date: dateString,
  title: requiredText("หัวข้อ", 120),
  description: optionalText(500),
  matchId: optionalId,
  isActive: checkbox,
});

export const announcementSchema = z.object({
  id: optionalId,
  title: requiredText("หัวข้อประกาศ", 160),
  content: requiredText("เนื้อหา", 4000),
  publishedAt: dateString,
  isPublished: checkbox,
});

export const settingsSchema = z.object({
  eventName: requiredText("ชื่องาน", 80),
  eventYear: z.coerce
    .number({ error: "กรุณากรอกปี" })
    .int("ปีไม่ถูกต้อง")
    .min(2000, "ปีไม่ถูกต้อง")
    .max(2600, "ปีไม่ถูกต้อง"),
  slogan: optionalText(120),
  rankPoints: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .regex(RANK_POINTS_PATTERN, "กรอกคะแนนคั่นด้วยจุลภาค เช่น 30,20,10,5")
      .optional(),
  ),
  galleryDriveUrl: z.preprocess(
    emptyToUndefined,
    z
      .url({ protocol: /^https$/, error: "ลิงก์ต้องขึ้นต้นด้วย https://" })
      .max(500)
      .optional(),
  ),
});
