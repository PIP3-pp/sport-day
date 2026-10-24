import { Pencil } from "lucide-react";
import { FormDialog } from "@/components/admin/action-form";
import { AdminPageHeader } from "@/components/admin/admin-page";
import { TeamForm } from "@/components/admin/team-form";
import { TeamLogo } from "@/components/shared/team-badge";
import { Button } from "@/components/ui/button";
import { updateTeam } from "@/lib/actions/teams";
import { fetchTeams } from "@/lib/queries/teams";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminTeamsPage() {
  await requireAdmin();
  const teams = await fetchTeams();

  return (
    <>
      <AdminPageHeader
        title="Teams"
        description="งานกีฬาสีมี 4 สีตายตัว แก้ไขชื่อ สโลแกน คำอธิบาย และโลโก้ได้"
      />
      <ul className="grid gap-4 sm:grid-cols-2">
        {teams.map((team) => (
          <li key={team.id} className="overflow-hidden rounded-lg border bg-card">
            <span aria-hidden className="block h-1.5" style={{ backgroundColor: team.color }} />
            <div className="flex items-start gap-4 p-4">
              <TeamLogo team={team} size={48} />
              <div className="min-w-0 flex-1">
                <p className="font-bold">{team.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {team.slogan || "ยังไม่มีสโลแกน"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  /teams/{team.slug} · {team.color}
                </p>
              </div>
              <FormDialog
                action={updateTeam}
                title={`แก้ไข${team.name}`}
                trigger={<Button variant="outline" size="sm" />}
                triggerLabel={
                  <>
                    <Pencil aria-hidden />
                    แก้ไข
                  </>
                }
              >
                <TeamForm team={team} />
              </FormDialog>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
