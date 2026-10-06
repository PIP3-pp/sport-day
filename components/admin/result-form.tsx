"use client";

import { useRef, useState } from "react";
import { TeamBadge } from "@/components/shared/team-badge";
import type { MatchView } from "@/lib/queries/matches";
import type { TeamRef } from "@/lib/queries/teams";
import { SelectField, TextField } from "./fields";

/**
 * Result entry for one match. Field names follow lib/validations/result.ts:
 * score_<teamId>, position_<teamId>, points_<teamId>.
 */
export function ResultForm({
  match,
  teams,
  rankPoints = [],
}: {
  match: MatchView;
  teams: TeamRef[];
  /** Default points by finishing position; fills a team's points when its position is chosen. */
  rankPoints?: number[];
}) {
  const isEdit = match.lines.length > 0;
  const [points, setPoints] = useState<Record<number, string>>(() =>
    Object.fromEntries(match.lines.map((l) => [l.team.id, String(l.points ?? "")])),
  );
  // Teams whose points were typed by hand (or loaded from a saved result) are never overwritten.
  const touched = useRef(new Set<number>(isEdit ? match.lines.map((l) => l.team.id) : []));
  const participants =
    match.format === "versus" ? [match.teamA!, match.teamB!] : teams;
  const lineOf = (teamId: number) => match.lines.find((l) => l.team.id === teamId);

  return (
    <>
      <input type="hidden" name="matchId" value={match.id} />
      {isEdit && <input type="hidden" name="mode" value="edit" />}
      <ul className="grid gap-4">
        {participants.map((team) => {
          const line = lineOf(team.id);
          return (
            <li key={team.id} className="grid gap-2 rounded-md border p-3">
              <TeamBadge team={team} className="font-semibold" />
              <div className="grid grid-cols-2 gap-3">
                {match.format === "versus" ? (
                  <TextField
                    name={`score_${team.id}`}
                    label="สกอร์"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    defaultValue={line?.score ?? ""}
                  />
                ) : (
                  <SelectField
                    name={`position_${team.id}`}
                    label="อันดับ"
                    defaultValue={line?.position ?? ""}
                    onChange={(event) => {
                      const suggested = rankPoints[Number(event.target.value) - 1];
                      if (suggested === undefined || touched.current.has(team.id)) return;
                      setPoints((current) => ({ ...current, [team.id]: String(suggested) }));
                    }}
                  >
                    <option value="" disabled>
                      เลือกอันดับ
                    </option>
                    {participants.map((_, index) => (
                      <option key={index} value={index + 1}>
                        อันดับ {index + 1}
                      </option>
                    ))}
                  </SelectField>
                )}
                <TextField
                  name={`points_${team.id}`}
                  label="คะแนนสะสมที่ได้"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={points[team.id] ?? ""}
                  onChange={(event) => {
                    touched.current.add(team.id);
                    setPoints((current) => ({ ...current, [team.id]: event.target.value }));
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted-foreground">
        คะแนนสะสมจะถูกนำไปรวมเป็นคะแนนรวมของแต่ละสีโดยอัตโนมัติ
      </p>
    </>
  );
}
