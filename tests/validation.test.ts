import { describe, expect, it } from "vitest";
import { formatDisplayDate, formatThaiDate, isValidDateString, todayInBangkok } from "@/lib/date";
import { rankByTotal } from "@/lib/standings";
import { matchSchema, settingsSchema } from "@/lib/validations";
import { parseResultLines } from "@/lib/validations/result";

const validMatch = {
  sportId: "1",
  date: "2026-10-05",
  startTime: "09:00",
  round: "รอบชิงชนะเลิศ",
  format: "versus",
  teamAId: "1",
  teamBId: "2",
  status: "scheduled",
};

describe("matchSchema", () => {
  it("accepts a valid versus match", () => {
    expect(matchSchema.safeParse(validMatch).success).toBe(true);
  });

  it("rejects Red vs Red", () => {
    const result = matchSchema.safeParse({ ...validMatch, teamBId: "1" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["teamBId"]);
  });

  it("rejects missing required fields", () => {
    const result = matchSchema.safeParse({ ...validMatch, sportId: "", round: " ", teamAId: "" });
    const paths = result.error?.issues.map((issue) => issue.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["sportId", "round", "teamAId"]));
  });

  it("rejects invalid dates and times", () => {
    expect(matchSchema.safeParse({ ...validMatch, date: "2026-02-30" }).success).toBe(false);
    expect(matchSchema.safeParse({ ...validMatch, startTime: "25:00" }).success).toBe(false);
  });

  it("does not let a form mark a match completed", () => {
    expect(matchSchema.safeParse({ ...validMatch, status: "completed" }).success).toBe(false);
  });

  it("needs no teams for an all-teams event", () => {
    const result = matchSchema.safeParse({
      ...validMatch,
      format: "all_teams",
      teamAId: "",
      teamBId: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("parseResultLines", () => {
  it("derives positions from versus scores", () => {
    const result = parseResultLines("versus", [1, 2], {
      score_1: "2",
      score_2: "1",
      points_1: "50",
      points_2: "30",
    });
    expect(result).toEqual({
      ok: true,
      lines: [
        { teamId: 1, score: 2, position: 1, points: 50 },
        { teamId: 2, score: 1, position: 2, points: 30 },
      ],
    });
  });

  it("gives both teams position 1 on a draw", () => {
    const result = parseResultLines("versus", [1, 2], {
      score_1: "1",
      score_2: "1",
      points_1: "20",
      points_2: "20",
    });
    expect(result.ok && result.lines.map((line) => line.position)).toEqual([1, 1]);
  });

  it("rejects negative, decimal and missing scores", () => {
    const result = parseResultLines("versus", [1, 2], {
      score_1: "-1",
      score_2: "1.5",
      points_1: "",
      points_2: "10",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.fieldErrors).sort()).toEqual(["points_1", "score_1", "score_2"]);
    }
  });

  it("requires a position within range for all-teams events", () => {
    const raw = { points_1: "40", points_2: "20", points_3: "10", points_4: "5" };
    const missing = parseResultLines("all_teams", [1, 2, 3, 4], raw);
    expect(missing.ok).toBe(false);
    const outOfRange = parseResultLines("all_teams", [1, 2, 3, 4], {
      ...raw,
      position_1: "1",
      position_2: "2",
      position_3: "3",
      position_4: "5",
    });
    expect(!outOfRange.ok && Object.keys(outOfRange.fieldErrors)).toEqual(["position_4"]);
  });

  it("rejects a duplicated team", () => {
    expect(parseResultLines("versus", [1, 1], {}).ok).toBe(false);
  });
});

describe("rankByTotal", () => {
  it("sorts by total and shares ranks on ties", () => {
    const ranked = rankByTotal([
      { id: "a", total: 25 },
      { id: "b", total: 80 },
      { id: "c", total: 90 },
      { id: "d", total: 80 },
    ]);
    expect(ranked.map((row) => [row.id, row.rank])).toEqual([
      ["c", 1],
      ["b", 2],
      ["d", 2],
      ["a", 4],
    ]);
  });
});

describe("settingsSchema", () => {
  it("only accepts https gallery links", () => {
    const base = { eventName: "SPORTS DAY", eventYear: "2026" };
    expect(settingsSchema.safeParse({ ...base, galleryDriveUrl: "https://drive.google.com/x" }).success).toBe(true);
    expect(settingsSchema.safeParse({ ...base, galleryDriveUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(settingsSchema.safeParse({ ...base, galleryDriveUrl: "" }).success).toBe(true);
  });
});

describe("date helpers", () => {
  it("uses the Bangkok calendar day", () => {
    // 18:30 UTC on 4 Oct is already 5 Oct in Thailand.
    expect(todayInBangkok(new Date("2026-10-04T18:30:00Z"))).toBe("2026-10-05");
  });

  it("validates and formats dates", () => {
    expect(isValidDateString("2026-10-05")).toBe(true);
    expect(isValidDateString("2026-13-01")).toBe(false);
    expect(formatThaiDate("2026-10-05")).toBe("5 ตุลาคม 2026");
    expect(formatDisplayDate("2026-10-05")).toBe("5 OCTOBER 2026");
  });
});
