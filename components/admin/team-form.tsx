"use client";

import type { Team } from "@/lib/queries/teams";
import { ImageField, TextareaField, TextField } from "./fields";

export function TeamForm({ team }: { team: Team }) {
  return (
    <>
      <input type="hidden" name="id" value={team.id} />
      <TextField name="name" label="ชื่อทีม" defaultValue={team.name} required />
      <TextField name="slogan" label="สโลแกน" defaultValue={team.slogan ?? ""} />
      <TextareaField
        name="description"
        label="คำอธิบาย"
        defaultValue={team.description ?? ""}
      />
      <ImageField
        name="logo"
        label="โลโก้ทีม"
        removeName="removeLogo"
        currentUrl={team.logoUrl}
      />
    </>
  );
}
