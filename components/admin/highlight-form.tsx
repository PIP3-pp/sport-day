"use client";

import type { Highlight } from "@/lib/queries/highlights";
import type { MatchView } from "@/lib/queries/matches";
import { formatThaiDate } from "@/lib/date";
import {
  CheckboxField,
  ImageField,
  SelectField,
  TextareaField,
  TextField,
} from "./fields";

function matchLabel(match: MatchView) {
  const teams =
    match.format === "versus"
      ? `${match.teamA?.name} พบ ${match.teamB?.name}`
      : "ทุกสี";
  return `${formatThaiDate(match.date)} · ${match.sport.name} ${match.round} · ${teams}`;
}

export function HighlightForm({
  highlight,
  matches,
  defaultDate,
}: {
  highlight?: Highlight;
  matches: MatchView[];
  defaultDate: string;
}) {
  return (
    <>
      {highlight && <input type="hidden" name="id" value={highlight.id} />}
      <TextField
        name="date"
        label="วันที่"
        type="date"
        defaultValue={highlight?.date ?? defaultDate}
      />
      <TextField name="title" label="หัวข้อ" defaultValue={highlight?.title} />
      <TextareaField
        name="description"
        label="รายละเอียด"
        defaultValue={highlight?.description ?? ""}
      />
      <SelectField
        name="matchId"
        label="การแข่งขันที่เกี่ยวข้อง"
        defaultValue={highlight?.matchId ?? ""}
        hint="ไม่บังคับ"
      >
        <option value="">ไม่ระบุ</option>
        {matches.map((match) => (
          <option key={match.id} value={match.id}>
            {matchLabel(match)}
          </option>
        ))}
      </SelectField>
      <ImageField
        name="image"
        label="รูปประกอบ"
        removeName="removeImage"
        currentUrl={highlight?.imageUrl ?? null}
      />
      <CheckboxField
        name="isActive"
        label="แสดงบนหน้าแรก"
        hint="แต่ละวันแสดงได้ 1 Highlight การเปิดอันนี้จะปิดอันอื่นของวันเดียวกัน"
        defaultChecked={highlight?.isActive ?? true}
      />
    </>
  );
}
