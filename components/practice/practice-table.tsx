import { Clock, MapPin } from "lucide-react";
import { TeamBadge } from "@/components/shared/team-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTime } from "@/lib/date";
import type { PracticeGroup } from "@/lib/queries/practice";

function timeRange(start: string, end: string) {
  return `${formatTime(start)}–${formatTime(end)} น.`;
}

/** One sport's practice slots: a table on wider screens, stacked cards on phones. */
export function PracticeTable({ group }: { group: PracticeGroup }) {
  const { sport, sessions } = group;
  const headingId = `practice-sport-${sport.id}`;

  return (
    <section aria-labelledby={headingId} className="overflow-hidden rounded-lg border bg-card">
      <h2
        id={headingId}
        className="flex items-center gap-2 border-b px-4 py-3 text-lg font-bold tracking-tight sm:px-5"
      >
        {sport.icon && <span aria-hidden>{sport.icon}</span>}
        {sport.name}
      </h2>

      <Table className="hidden table-fixed sm:table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4 pl-5">สี</TableHead>
            <TableHead className="w-1/4">วัน</TableHead>
            <TableHead className="w-1/5">เวลา</TableHead>
            <TableHead className="pr-5">สถานที่</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell className="pl-5 font-semibold">
                <TeamBadge team={session.team} />
              </TableCell>
              <TableCell className="whitespace-normal">{session.days}</TableCell>
              <TableCell className="font-semibold tabular-nums">
                {timeRange(session.startTime, session.endTime)}
              </TableCell>
              <TableCell className="pr-5 whitespace-normal">
                {session.location}
                {session.note && (
                  <span className="block text-xs text-muted-foreground">{session.note}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ul className="divide-y sm:hidden">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="border-l-4 px-4 py-3"
            style={{ borderLeftColor: session.team.color }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <TeamBadge team={session.team} className="font-semibold" />
              <span className="shrink-0 text-sm text-muted-foreground">{session.days}</span>
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold tabular-nums">
              <Clock aria-hidden className="size-3.5 text-muted-foreground" />
              {timeRange(session.startTime, session.endTime)}
            </p>
            <p className="mt-1 flex items-start gap-1.5 text-sm">
              <MapPin aria-hidden className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <span>
                {session.location}
                {session.note && (
                  <span className="block text-xs text-muted-foreground">{session.note}</span>
                )}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
