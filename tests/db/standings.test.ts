import { beforeEach, describe, expect, it } from "vitest";
import { saveResult } from "@/lib/actions/results";
import { fetchStandings } from "@/lib/queries/standings";
import { createMatch, EMPTY, form, seedTeams } from "./fixtures";

let sportId: number;

beforeEach(async () => {
  ({ sportId } = await seedTeams());
});

async function allTeams(positions: number[], points: number[]) {
  const matchId = await createMatch(sportId, { format: "all_teams" });
  const fields: Record<string, number> = { matchId };
  positions.forEach((position, i) => (fields[`position_${i + 1}`] = position));
  points.forEach((value, i) => (fields[`points_${i + 1}`] = value));
  expect((await saveResult(EMPTY, form(fields))).ok).toBe(true);
}

async function versus(teamAId: number, teamBId: number, scores: number[], points: number[]) {
  const matchId = await createMatch(sportId, { format: "versus", teamAId, teamBId });
  const state = await saveResult(
    EMPTY,
    form({
      matchId,
      [`score_${teamAId}`]: scores[0],
      [`score_${teamBId}`]: scores[1],
      [`points_${teamAId}`]: points[0],
      [`points_${teamBId}`]: points[1],
    }),
  );
  expect(state.ok).toBe(true);
}

const summary = async () =>
  (await fetchStandings()).map(({ id, total, golds, rank }) => ({ id, total, golds, rank }));

describe("fetchStandings", () => {
  it("lists every team at zero before any result", async () => {
    expect(await summary()).toEqual([1, 2, 3, 4].map((id) => ({ id, total: 0, golds: 0, rank: 1 })));
  });

  it("sums points across matches", async () => {
    await allTeams([1, 2, 3, 4], [30, 20, 10, 5]);
    await versus(2, 4, [0, 2], [0, 25]);

    expect(await summary()).toEqual([
      { id: 1, total: 30, golds: 1, rank: 1 },
      { id: 4, total: 30, golds: 1, rank: 1 },
      { id: 2, total: 20, golds: 0, rank: 3 },
      { id: 3, total: 10, golds: 0, rank: 4 },
    ]);
  });

  it("breaks a tie on total by golds, then shares the rank", async () => {
    await allTeams([1, 2, 3, 4], [10, 10, 5, 5]);

    expect(await summary()).toEqual([
      { id: 1, total: 10, golds: 1, rank: 1 },
      { id: 2, total: 10, golds: 0, rank: 2 },
      { id: 3, total: 5, golds: 0, rank: 3 },
      { id: 4, total: 5, golds: 0, rank: 3 },
    ]);
  });

  it("counts a draw as a gold for both teams", async () => {
    await versus(1, 2, [1, 1], [15, 15]);
    await versus(3, 4, [0, 3], [0, 15]);

    expect(await summary()).toEqual([
      { id: 1, total: 15, golds: 1, rank: 1 },
      { id: 2, total: 15, golds: 1, rank: 1 },
      { id: 4, total: 15, golds: 1, rank: 1 },
      { id: 3, total: 0, golds: 0, rank: 4 },
    ]);
  });
});
