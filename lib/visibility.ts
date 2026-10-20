/**
 * Parts of the public site an admin can switch on and off from /admin/display.
 * Pages that are switched off disappear from the menu and answer 404.
 */
export const SECTIONS = [
  { key: "banner", group: "home", label: "รูปปก (Banner)" },
  { key: "hero", group: "home", label: "ชื่องานและสโลแกน" },
  { key: "liveMatches", group: "home", label: "กำลังแข่งขัน" },
  { key: "standings", group: "home", label: "คะแนนรวม" },
  { key: "todayOverview", group: "home", label: "ภาพรวมการแข่งขันวันนี้" },
  { key: "latestResults", group: "home", label: "ผลการแข่งขันล่าสุด" },
  { key: "todayMatches", group: "home", label: "การแข่งขันวันนี้" },
  { key: "highlight", group: "home", label: "Highlight of the Day" },
  { key: "announcements", group: "home", label: "ข่าวสาร" },
  { key: "gallerySection", group: "home", label: "ลิงก์ Gallery" },
  { key: "practicePage", group: "page", label: "ตารางซ้อม", href: "/practice" },
  { key: "schedulePage", group: "page", label: "ตารางการแข่งขัน", href: "/schedule" },
  { key: "resultsPage", group: "page", label: "ผลการแข่งขัน", href: "/results" },
  { key: "teamsPage", group: "page", label: "ทีมสี", href: "/teams" },
  { key: "galleryPage", group: "page", label: "Gallery", href: "/gallery" },
] as const;

export type SectionKey = (typeof SECTIONS)[number]["key"];
export type Visibility = Record<SectionKey, boolean>;

export const SECTION_KEYS = SECTIONS.map((s) => s.key) as SectionKey[];

// The match schedule is kept but closed for now; practice schedules replace it.
const CLOSED_BY_DEFAULT: SectionKey[] = [
  "schedulePage",
  "liveMatches",
  "todayOverview",
  "todayMatches",
];

export const DEFAULT_VISIBILITY = Object.fromEntries(
  SECTION_KEYS.map((key) => [key, !CLOSED_BY_DEFAULT.includes(key)]),
) as Visibility;

export function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === "string" && (SECTION_KEYS as string[]).includes(value);
}

/** Stored settings over the defaults; unknown keys and non-boolean values are ignored. */
export function parseVisibility(stored: unknown): Visibility {
  const result = { ...DEFAULT_VISIBILITY };
  if (stored && typeof stored === "object") {
    for (const [key, value] of Object.entries(stored)) {
      if (isSectionKey(key) && typeof value === "boolean") result[key] = value;
    }
  }
  return result;
}

/** Public hrefs whose page is switched off. */
export function hiddenPages(visibility: Visibility): string[] {
  return SECTIONS.filter((s) => s.group === "page" && !visibility[s.key]).map(
    (s) => (s as { href: string }).href,
  );
}
