"use client";

import type { PracticeView } from "@/lib/queries/practice";
import type { Sport } from "@/lib/queries/sports";
import type { Team } from "@/lib/queries/teams";
import { SelectField, TextField } from "./fields";

export function PracticeForm({
  practice,
  sports,
  teams,
}: {
  practice?: PracticeView;
  sports: Sport[];
  teams: Team[];
}) {
  return (
    <>
      {practice && <input type="hidden" name="id" value={practice.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          name="sportId"
          label="กีฬา"
          defaultValue={practice?.sport.id ?? ""}
          required
        >
          <option value="" disabled>
            เลือกกีฬา
          </option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {`${sport.icon ?? ""} ${sport.name}`.trim()}
            </option>
          ))}
        </SelectField>
        <SelectField name="teamId" label="สี" defaultValue={practice?.team.id ?? ""} required>
          <option value="" disabled>
            เลือกสี
          </option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </SelectField>
      </div>
      <TextField
        name="days"
        label="วันซ้อม"
        defaultValue={practice?.days}
        placeholder="จันทร์–ศุกร์"
        hint="พิมพ์ได้อิสระ เช่น ทุกวันอังคาร, 21–23 ต.ค."
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          name="startTime"
          label="เวลาเริ่ม"
          type="time"
          defaultValue={practice?.startTime.slice(0, 5)}
          required
        />
        <TextField
          name="endTime"
          label="เวลาเลิก"
          type="time"
          defaultValue={practice?.endTime.slice(0, 5)}
          required
        />
      </div>
      <TextField
        name="location"
        label="สถานที่"
        defaultValue={practice?.location}
        placeholder="สนามฟุตบอล"
        required
      />
      <TextField
        name="note"
        label="หมายเหตุ (ไม่บังคับ)"
        defaultValue={practice?.note ?? ""}
        placeholder="นำรองเท้าสตั๊ดมาด้วย"
      />
    </>
  );
}
