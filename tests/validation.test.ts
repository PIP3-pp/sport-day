import { describe, expect, it } from "vitest";
import { formatDisplayDate, formatThaiDate, isValidDateString, todayInBangkok } from "@/lib/date";
import { detectImageType } from "@/lib/image-type";
import { parsePage, parseSteps, RESULTS_MAX_STEPS } from "@/lib/pagination";
import { parseRankPoints } from "@/lib/rank-points";
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

describe("rankByTotal tie-break", () => {
  it("breaks a points tie by first-place finishes", () => {
    const ranked = rankByTotal([
      { id: 1, total: 50, golds: 1 },
      { id: 2, total: 50, golds: 3 },
      { id: 3, total: 50, golds: 3 },
      { id: 4, total: 40, golds: 9 },
    ]);
    expect(ranked.map((r) => [r.id, r.rank])).toEqual([
      [2, 1],
      [3, 1],
      [1, 3],
      [4, 4],
    ]);
  });
});

describe("parseRankPoints", () => {
  it("reads a comma list and ignores anything else", () => {
    expect(parseRankPoints("30, 20,10 ,5")).toEqual([30, 20, 10, 5]);
    expect(parseRankPoints("")).toEqual([]);
    expect(parseRankPoints(null)).toEqual([]);
    expect(parseRankPoints("30,abc")).toEqual([]);
    expect(parseRankPoints("-5")).toEqual([]);
  });

  it("is validated in settings", () => {
    const base = { eventName: "SPORTS DAY", eventYear: "2026" };
    expect(settingsSchema.safeParse({ ...base, rankPoints: "30,20,10,5" }).success).toBe(true);
    expect(settingsSchema.safeParse({ ...base, rankPoints: "" }).success).toBe(true);
    expect(settingsSchema.safeParse({ ...base, rankPoints: "a,b" }).success).toBe(false);
  });
});

describe("detectImageType", () => {
  const bytes = (...values: number[]) => new Uint8Array(values);

  it("identifies images by signature", () => {
    expect(detectImageType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0))).toBe("image/png");
    expect(detectImageType(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe("image/jpeg");
    expect(
      detectImageType(bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50)),
    ).toBe("image/webp");
  });

  it("rejects anything else, whatever its claimed type", () => {
    expect(detectImageType(new TextEncoder().encode("<svg onload=alert(1)>"))).toBeNull();
    expect(detectImageType(new TextEncoder().encode("GIF89a"))).toBeNull();
    expect(detectImageType(bytes())).toBeNull();
  });
});

describe("parseSteps and parsePage", () => {
  it("clamps to a safe range", () => {
    expect(parseSteps(undefined)).toBe(1);
    expect(parseSteps("3")).toBe(3);
    expect(parseSteps("-1")).toBe(1);
    expect(parseSteps("1.5")).toBe(1);
    expect(parseSteps("99999")).toBe(RESULTS_MAX_STEPS);
    expect(parsePage("abc")).toBe(1);
    expect(parsePage("4")).toBe(4);
  });
});

describe("in-progress matches", () => {
  it("can be set by the match form but still not completed", () => {
    expect(matchSchema.safeParse({ ...validMatch, status: "in_progress" }).success).toBe(true);
    expect(matchSchema.safeParse({ ...validMatch, status: "completed" }).success).toBe(false);
  });
});
