// DEMO DATA ONLY — for local development and previews.
// Never run this against the production database.
import { config } from "dotenv";
config({ path: ".env.local" });

function bangkokDate(offsetDays: number) {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" }).format(d);
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed demo data in production.");
  }
  const { db, pool } = await import("./index");
  const s = await import("./schema");

  const existing = await db.select({ id: s.matches.id }).from(s.matches).limit(1);
  if (existing.length > 0) {
    throw new Error("Matches already exist; demo seed expects an empty schedule.");
  }

  const teamRows = await db.select().from(s.teams);
  const team = (slug: string) => teamRows.find((t) => t.slug === slug)!.id;

  const sportRows = await db
    .insert(s.sports)
    .values([
      { name: "ฟุตบอล", icon: "⚽" },
      { name: "วอลเลย์บอล", icon: "🏐" },
      { name: "บาสเกตบอล", icon: "🏀" },
      { name: "กรีฑา", icon: "🏃" },
    ])
    .returning();
  const sport = (name: string) => sportRows.find((r) => r.name === name)!.id;

  const today = bangkokDate(0);
  const yesterday = bangkokDate(-1);
  const tomorrow = bangkokDate(1);

  const versus = (
    date: string,
    startTime: string,
    sportName: string,
    round: string,
    a: string,
    b: string,
  ) => ({
    date,
    startTime,
    sportId: sport(sportName),
    round,
    format: "versus" as const,
    teamAId: team(a),
    teamBId: team(b),
  });

  const matchRows = await db
    .insert(s.matches)
    .values([
      versus(yesterday, "09:00", "ฟุตบอล", "รอบรองชนะเลิศ", "sky-blue", "purple"),
      versus(yesterday, "13:00", "บาสเกตบอล", "รอบแรก", "red", "green"),
      versus(today, "09:00", "ฟุตบอล", "รอบชิงชนะเลิศ", "red", "sky-blue"),
      versus(today, "11:00", "วอลเลย์บอล", "รอบรองชนะเลิศ", "green", "purple"),
      {
        date: today,
        startTime: "13:00",
        sportId: sport("กรีฑา"),
        round: "วิ่ง 100 เมตรชาย",
        format: "all_teams" as const,
      },
      versus(today, "15:00", "บาสเกตบอล", "รอบชิงชนะเลิศ", "red", "green"),
      versus(tomorrow, "09:00", "วอลเลย์บอล", "รอบชิงชนะเลิศ", "green", "red"),
    ])
    .returning();

  type Line = { slug: string; score?: number; position: number; points: number };
  const record = async (index: number, lines: Line[]) => {
    const match = matchRows[index];
    await db.insert(s.results).values(
      lines.map((l) => ({
        matchId: match.id,
        teamId: team(l.slug),
        score: l.score ?? null,
        position: l.position,
      })),
    );
    await db.insert(s.scorePoints).values(
      lines.map((l) => ({
        matchId: match.id,
        teamId: team(l.slug),
        points: l.points,
      })),
    );
  };

  await record(0, [
    { slug: "sky-blue", score: 3, position: 1, points: 30 },
    { slug: "purple", score: 2, position: 2, points: 10 },
  ]);
  await record(1, [
    { slug: "red", score: 42, position: 1, points: 30 },
    { slug: "green", score: 38, position: 2, points: 10 },
  ]);
  await record(2, [
    { slug: "red", score: 2, position: 1, points: 50 },
    { slug: "sky-blue", score: 1, position: 2, points: 30 },
  ]);
  await record(3, [
    { slug: "green", score: 2, position: 1, points: 30 },
    { slug: "purple", score: 0, position: 2, points: 10 },
  ]);

  const { inArray } = await import("drizzle-orm");
  await db
    .update(s.matches)
    .set({ status: "completed" })
    .where(inArray(s.matches.id, matchRows.slice(0, 4).map((m) => m.id)));

  await db.insert(s.highlights).values({
    date: today,
    title: "ศึกชิงอันดับหนึ่ง",
    description: "ฟุตบอลชาย รอบชิงชนะเลิศ สีแดงเฉือนชนะสีฟ้าในช่วงท้ายเกม",
    matchId: matchRows[2].id,
    isActive: true,
  });

  await db.insert(s.announcements).values([
    {
      title: "ประกาศเปลี่ยนแปลงตารางการแข่งขัน",
      content: "บาสเกตบอลรอบชิงชนะเลิศ เลื่อนเวลาแข่งขันเป็น 15:00 น.",
      publishedAt: today,
      isPublished: true,
    },
    {
      title: "ประกาศกำหนดการแข่งขันรอบชิงชนะเลิศ",
      content: "ตรวจสอบกำหนดการรอบชิงชนะเลิศได้ที่หน้าตารางการแข่งขัน",
      publishedAt: yesterday,
      isPublished: true,
    },
  ]);

  console.log("Seeded demo data.");
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
