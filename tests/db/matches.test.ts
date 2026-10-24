import { updateTag } from "next/cache";
import { beforeEach, describe, expect, it } from "vitest";
import type { MatchStatus } from "@/db/schema";
import { startMatch } from "@/lib/actions/matches";
import { createMatch, EMPTY, form, matchStatus, seedTeams } from "./fixtures";

let sportId: number;

beforeEach(async () => {
  ({ sportId } = await seedTeams());
});

const match = (status?: MatchStatus) =>
  createMatch(sportId, { format: "versus", teamAId: 1, teamBId: 2 }, status);

describe("startMatch", () => {
  it("moves a scheduled match to in progress", async () => {
    const matchId = await match();
    const state = await startMatch(EMPTY, form({ id: matchId }));

    expect(state.ok).toBe(true);
    expect(await matchStatus(matchId)).toBe("in_progress");
    expect(updateTag).toHaveBeenCalledWith("matches");
  });

  it.each<MatchStatus>(["in_progress", "completed", "postponed", "cancelled"])(
    "leaves a %s match as it is",
    async (status) => {
      const matchId = await match(status);
      const state = await startMatch(EMPTY, form({ id: matchId }));

      expect(state.ok).toBe(false);
      expect(await matchStatus(matchId)).toBe(status);
      // The admin list is refreshed so it shows the real status.
      expect(updateTag).toHaveBeenCalledWith("matches");
    },
  );

  it("does not affect other matches", async () => {
    const started = await match();
    const other = await match();
    await startMatch(EMPTY, form({ id: started }));

    expect(await matchStatus(other)).toBe("scheduled");
  });
});
