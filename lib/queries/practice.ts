import "server-only";
import { db } from "@/db";
import { cached, TAGS } from "./cache";
import type { TeamRef } from "./teams";

export type PracticeView = {
  id: number;
  days: string;
  startTime: string;
  endTime: string;
  location: string;
  note: string | null;
  sport: { id: number; name: string; icon: string | null };
  team: TeamRef;
};

/** Every practice slot, ordered by sport name, then team, then start time. */
export async function fetchPracticeSessions(): Promise<PracticeView[]> {
  const rows = await db.query.practiceSessions.findMany({
    with: { sport: true, team: true },
    orderBy: (p, { asc }) => [asc(p.teamId), asc(p.startTime)],
  });
  return rows
    .map((row) => ({
      id: row.id,
      days: row.days,
      startTime: row.startTime,
      endTime: row.endTime,
      location: row.location,
      note: row.note,
      sport: { id: row.sport.id, name: row.sport.name, icon: row.sport.icon },
      team: {
        id: row.team.id,
        name: row.team.name,
        slug: row.team.slug,
        color: row.team.color,
        logoUrl: row.team.logoUrl,
      },
    }))
    .sort((a, b) => a.sport.name.localeCompare(b.sport.name, "th"));
}

export const getPracticeSessions = cached(fetchPracticeSessions, "practice-sessions", [
  TAGS.practice,
  TAGS.sports,
  TAGS.teams,
]);

export type PracticeGroup = {
  sport: PracticeView["sport"];
  sessions: PracticeView[];
};

/** Groups already-sorted sessions by sport, keeping their order. */
export function groupBySport(sessions: PracticeView[]): PracticeGroup[] {
  const groups = new Map<number, PracticeGroup>();
  for (const session of sessions) {
    const group = groups.get(session.sport.id) ?? { sport: session.sport, sessions: [] };
    group.sessions.push(session);
    groups.set(session.sport.id, group);
  }
  return [...groups.values()];
}
