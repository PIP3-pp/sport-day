"use client";

import { TeamBadge } from "@/components/shared/team-badge";
import type { MatchView } from "@/lib/queries/matches";
import type { TeamRef } from "@/lib/queries/teams";
import { SelectField, TextField } from "./fields";

/**
 * Result entry for one match. Field names follow lib/validations/result.ts:
 * score_<teamId>, position_<teamId>, points_<teamId>.
 */
export function ResultForm({ match, teams }: { match: MatchView; teams: TeamRef[] }) {
  const isEdit = match.lines.length > 0;
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
                  defaultValue={line?.points ?? ""}
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
