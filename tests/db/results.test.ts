import { updateTag } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { auditLog } from "@/db/schema";
import { deleteResult, saveResult } from "@/lib/actions/results";
import { getAdminSession } from "@/lib/require-admin";
import { db } from "./client";
import {
  createMatch,
  EMPTY,
  form,
  matchStatus,
  pointRows,
  resultRows,
  seedTeams,
} from "./fixtures";

let sportId: number;

beforeEach(async () => {
  ({ sportId } = await seedTeams());
});

const versus = () => createMatch(sportId, { format: "versus", teamAId: 1, teamBId: 2 });

describe("saveResult", () => {
  it("saves a versus result, its points and completes the match", async () => {
    const matchId = await versus();
    const state = await saveResult(
      EMPTY,
      form({ matchId, score_1: 3, score_2: 1, points_1: 50, points_2: 30 }),
    );

    expect(state.ok).toBe(true);
    expect(await resultRows(matchId)).toEqual([
      { teamId: 1, score: 3, position: 1 },
      { teamId: 2, score: 1, position: 2 },
    ]);
    expect(await pointRows(matchId)).toEqual([
      { teamId: 1, points: 50 },
      { teamId: 2, points: 30 },
    ]);
    expect(await matchStatus(matchId)).toBe("completed");
    expect(updateTag).toHaveBeenCalledWith("matches");
    const [log] = await db.select().from(auditLog);
    expect(log).toMatchObject({ actor: "admin@test.local", action: "result.create" });
  });

  it("saves an all-teams result with a position for every team", async () => {
    const matchId = await createMatch(sportId, { format: "all_teams" });
    const state = await saveResult(
      EMPTY,
      form({
        matchId,
        position_1: 2,
        position_2: 1,
        position_3: 4,
        position_4: 3,
        points_1: 20,
        points_2: 30,
        points_3: 5,
        points_4: 10,
      }),
    );

    expect(state.ok).toBe(true);
    expect(await resultRows(matchId)).toEqual([
      { teamId: 1, score: null, position: 2 },
      { teamId: 2, score: null, position: 1 },
      { teamId: 3, score: null, position: 4 },
      { teamId: 4, score: null, position: 3 },
    ]);
    expect((await pointRows(matchId)).map((row) => row.points)).toEqual([20, 30, 5, 10]);
    expect(await matchStatus(matchId)).toBe("completed");
  });

  it("only takes participants from the database, ignoring extra teams in the form", async () => {
    const matchId = await versus();
    await saveResult(
      EMPTY,
      form({ matchId, score_1: 1, score_2: 0, points_1: 5, points_2: 0, score_3: 9, points_3: 99 }),
    );
    expect((await pointRows(matchId)).map((row) => row.teamId)).toEqual([1, 2]);
  });

  it("rejects a second submission and keeps the first result", async () => {
    const matchId = await versus();
    await saveResult(EMPTY, form({ matchId, score_1: 3, score_2: 1, points_1: 50, points_2: 30 }));
    const state = await saveResult(
      EMPTY,
      form({ matchId, score_1: 0, score_2: 5, points_1: 0, points_2: 50 }),
    );

    expect(state.ok).toBe(false);
    expect(state.message).toContain("บันทึกผลไปแล้ว");
    expect(await resultRows(matchId)).toEqual([
      { teamId: 1, score: 3, position: 1 },
      { teamId: 2, score: 1, position: 2 },
    ]);
    expect((await pointRows(matchId)).map((row) => row.points)).toEqual([50, 30]);
  });

  it("replaces the result in edit mode", async () => {
    const matchId = await versus();
    await saveResult(EMPTY, form({ matchId, score_1: 3, score_2: 1, points_1: 50, points_2: 30 }));
    const state = await saveResult(
      EMPTY,
      form({ matchId, mode: "edit", score_1: 2, score_2: 2, points_1: 40, points_2: 40 }),
    );

    expect(state.ok).toBe(true);
    expect(await resultRows(matchId)).toEqual([
      { teamId: 1, score: 2, position: 1 },
      { teamId: 2, score: 2, position: 1 },
    ]);
    expect((await pointRows(matchId)).map((row) => row.points)).toEqual([40, 40]);
    expect(await matchStatus(matchId)).toBe("completed");
  });

  it("refuses a postponed match", async () => {
    const matchId = await createMatch(
      sportId,
      { format: "versus", teamAId: 1, teamBId: 2 },
      "postponed",
    );
    const state = await saveResult(
      EMPTY,
      form({ matchId, score_1: 1, score_2: 0, points_1: 5, points_2: 0 }),
    );

    expect(state.ok).toBe(false);
    expect(await resultRows(matchId)).toEqual([]);
    expect(await matchStatus(matchId)).toBe("postponed");
  });

  it("writes nothing when the form is invalid", async () => {
    const matchId = await versus();
    const state = await saveResult(EMPTY, form({ matchId, score_1: 1, points_1: 5, points_2: 0 }));

    expect(state.ok).toBe(false);
    expect(state.fieldErrors).toHaveProperty("score_2");
    expect(await resultRows(matchId)).toEqual([]);
    expect(await matchStatus(matchId)).toBe("scheduled");
  });

  it("does nothing without an admin session", async () => {
    vi.mocked(getAdminSession).mockResolvedValueOnce(null);
    const matchId = await versus();
    const state = await saveResult(
      EMPTY,
      form({ matchId, score_1: 1, score_2: 0, points_1: 5, points_2: 0 }),
    );

    expect(state.ok).toBe(false);
    expect(await resultRows(matchId)).toEqual([]);
  });
});

describe("deleteResult", () => {
  it("removes the result and points and returns the match to scheduled", async () => {
    const matchId = await versus();
    await saveResult(EMPTY, form({ matchId, score_1: 3, score_2: 1, points_1: 50, points_2: 30 }));
    const state = await deleteResult(EMPTY, form({ id: matchId }));

    expect(state.ok).toBe(true);
    expect(await resultRows(matchId)).toEqual([]);
    expect(await pointRows(matchId)).toEqual([]);
    expect(await matchStatus(matchId)).toBe("scheduled");
    expect(updateTag).toHaveBeenCalledWith("matches");
  });

  it("leaves a match without a result unchanged", async () => {
    const matchId = await createMatch(
      sportId,
      { format: "versus", teamAId: 1, teamBId: 2 },
      "cancelled",
    );
    const state = await deleteResult(EMPTY, form({ id: matchId }));

    expect(state.ok).toBe(false);
    expect(await matchStatus(matchId)).toBe("cancelled");
    expect(await db.select().from(auditLog)).toEqual([]);
  });

  it("only touches the given match", async () => {
    const first = await versus();
    const second = await createMatch(sportId, { format: "versus", teamAId: 3, teamBId: 4 });
    await saveResult(EMPTY, form({ matchId: first, score_1: 1, score_2: 0, points_1: 5, points_2: 0 }));
    await saveResult(EMPTY, form({ matchId: second, score_3: 1, score_4: 0, points_3: 5, points_4: 0 }));
    await deleteResult(EMPTY, form({ id: first }));

    expect(await resultRows(second)).toHaveLength(2);
    expect(await matchStatus(second)).toBe("completed");
  });
});
