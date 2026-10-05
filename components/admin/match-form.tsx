"use client";

import { useState } from "react";
import { FORMAT_LABELS, STATUS_LABELS } from "@/lib/labels";
import type { MatchView } from "@/lib/queries/matches";
import type { Sport } from "@/lib/queries/sports";
import type { TeamRef } from "@/lib/queries/teams";
import { formatTime } from "@/lib/date";
import { EDITABLE_MATCH_STATUSES, type MatchFormat } from "@/lib/match-constants";
import { SelectField, TextField } from "./fields";

export function MatchForm({
  match,
  sports,
  teams,
  defaultDate,
}: {
  match?: MatchView;
  sports: Sport[];
  teams: TeamRef[];
  defaultDate: string;
}) {
  const [format, setFormat] = useState<MatchFormat>(match?.format ?? "versus");
  // Once a result exists the participants are fixed; the server enforces this too.
  const locked = (match?.lines.length ?? 0) > 0;
  // Keep a disabled sport selectable when editing a match that already uses it.
  const sportOptions = sports.filter((s) => s.isActive || s.id === match?.sport.id);

  return (
    <>
      {match && <input type="hidden" name="id" value={match.id} />}
      <SelectField name="sportId" label="กีฬา" defaultValue={match?.sport.id ?? ""}>
        <option value="" disabled>
          เลือกกีฬา
        </option>
        {sportOptions.map((sport) => (
          <option key={sport.id} value={sport.id}>
            {sport.icon} {sport.name}
          </option>
        ))}
      </SelectField>
      <TextField
        name="round"
        label="รอบ / รายการ"
        defaultValue={match?.round}
        placeholder="เช่น รอบชิงชนะเลิศ, วิ่ง 100 เมตรชาย"
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          name="date"
          label="วันที่"
          type="date"
          defaultValue={match?.date ?? defaultDate}
        />
        <TextField
          name="startTime"
          label="เวลาเริ่ม"
          type="time"
          defaultValue={match ? formatTime(match.startTime) : ""}
        />
      </div>

      {locked ? (
        <>
          <input type="hidden" name="format" value={match!.format} />
          <input type="hidden" name="teamAId" value={match!.teamA?.id ?? ""} />
          <input type="hidden" name="teamBId" value={match!.teamB?.id ?? ""} />
          <input type="hidden" name="status" value="scheduled" />
          <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            การแข่งขันนี้บันทึกผลแล้ว จึงแก้ไขทีม รูปแบบ และสถานะไม่ได้
            หากต้องการเปลี่ยนให้ลบผลการแข่งขันก่อน
          </p>
        </>
      ) : (
        <>
          <SelectField
            name="format"
            label="รูปแบบการแข่งขัน"
            value={format}
            onChange={(event) => setFormat(event.target.value as MatchFormat)}
          >
            {Object.entries(FORMAT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
          {format === "versus" && (
            <div className="grid grid-cols-2 gap-3">
              <SelectField name="teamAId" label="ทีม A" defaultValue={match?.teamA?.id ?? ""}>
                <option value="" disabled>
                  เลือกทีม
                </option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </SelectField>
              <SelectField name="teamBId" label="ทีม B" defaultValue={match?.teamB?.id ?? ""}>
                <option value="" disabled>
                  เลือกทีม
                </option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </SelectField>
            </div>
          )}
          <SelectField
            name="status"
            label="สถานะ"
            defaultValue={match?.status ?? "scheduled"}
            hint="สถานะ “เสร็จสิ้น” จะถูกตั้งให้อัตโนมัติเมื่อบันทึกผลการแข่งขัน"
          >
            {EDITABLE_MATCH_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </SelectField>
        </>
      )}
    </>
  );
}
