import type { MatchFormat } from "@/lib/match-constants";

export type ResultLine = {
  teamId: number;
  score: number | null;
  position: number;
  points: number;
};

export type ResultParse =
  | { ok: true; lines: ResultLine[] }
  | { ok: false; fieldErrors: Record<string, string[]> };

const MAX_SCORE = 999;
const MAX_POINTS = 9999;

function parseInteger(raw: string | undefined, min: number, max: number) {
  if (raw === undefined || raw.trim() === "") return null;
  if (!/^\d+$/.test(raw.trim())) return Number.NaN;
  const value = Number(raw.trim());
  return value >= min && value <= max ? value : Number.NaN;
}

/**
 * Validates the result form for one match. Field names are
 * `score_<teamId>`, `position_<teamId>` and `points_<teamId>`.
 *
 * - versus: a score per team; positions are derived from the scores.
 * - all_teams: a finishing position per team (ties allowed).
 */
export function parseResultLines(
  format: MatchFormat,
  teamIds: number[],
  raw: Record<string, string | undefined>,
): ResultParse {
  const fieldErrors: Record<string, string[]> = {};
  const fail = (field: string, message: string) => {
    fieldErrors[field] = [message];
  };

  if (new Set(teamIds).size !== teamIds.length || teamIds.length < 2) {
    return { ok: false, fieldErrors: { form: ["ข้อมูลทีมไม่ถูกต้อง"] } };
  }

  const lines: ResultLine[] = [];
  for (const teamId of teamIds) {
    const points = parseInteger(raw[`points_${teamId}`], 0, MAX_POINTS);
    if (points === null) fail(`points_${teamId}`, "กรุณากรอกคะแนนที่ได้");
    else if (Number.isNaN(points)) {
      fail(`points_${teamId}`, `คะแนนต้องเป็นจำนวนเต็ม 0–${MAX_POINTS}`);
    }

    let score: number | null = null;
    let position = 0;
    if (format === "versus") {
      score = parseInteger(raw[`score_${teamId}`], 0, MAX_SCORE);
      if (score === null) fail(`score_${teamId}`, "กรุณากรอกสกอร์");
      else if (Number.isNaN(score)) {
        fail(`score_${teamId}`, `สกอร์ต้องเป็นจำนวนเต็ม 0–${MAX_SCORE}`);
      }
    } else {
      const parsed = parseInteger(raw[`position_${teamId}`], 1, teamIds.length);
      if (parsed === null) fail(`position_${teamId}`, "กรุณาเลือกอันดับ");
      else if (Number.isNaN(parsed)) {
        fail(`position_${teamId}`, `อันดับต้องอยู่ระหว่าง 1–${teamIds.length}`);
      } else position = parsed;
    }

    lines.push({ teamId, score, position, points: points ?? 0 });
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  if (format === "versus") {
    const [a, b] = lines;
    a.position = a.score! >= b.score! ? 1 : 2;
    b.position = b.score! >= a.score! ? 1 : 2;
  }
  return { ok: true, lines };
}
