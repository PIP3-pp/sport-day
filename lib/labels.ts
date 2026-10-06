import type { MatchFormat, MatchStatus } from "@/lib/match-constants";

export const STATUS_LABELS: Record<MatchStatus, string> = {
  scheduled: "ยังไม่เริ่ม",
  in_progress: "กำลังแข่งขัน",
  completed: "เสร็จสิ้น",
  postponed: "เลื่อนการแข่งขัน",
  cancelled: "ยกเลิก",
};

export const FORMAT_LABELS: Record<MatchFormat, string> = {
  versus: "แข่งเป็นคู่ (A พบ B)",
  all_teams: "ทุกสีแข่งพร้อมกัน (จัดอันดับ)",
};
