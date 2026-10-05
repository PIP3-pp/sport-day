const TIME_ZONE = "Asia/Bangkok";

/** Today's date in Thailand as YYYY-MM-DD. */
export function todayInBangkok(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now);
}

export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function asUtcDate(dateString: string): Date {
  return new Date(`${dateString}T00:00:00Z`);
}

/** "5 ตุลาคม 2026" */
export function formatThaiDate(dateString: string): string {
  return new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(asUtcDate(dateString));
}

/** "5 OCTOBER 2026" (or "5 OCTOBER" without the year) */
export function formatDisplayDate(dateString: string, withYear = true): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  })
    .format(asUtcDate(dateString))
    .toUpperCase();
}

/** Short pieces for date chips: { day: "5", month: "ต.ค.", weekday: "จ." } */
export function dateParts(dateString: string) {
  const d = asUtcDate(dateString);
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
      ...options,
      timeZone: "UTC",
    }).format(d);
  return {
    day: part({ day: "numeric" }),
    month: part({ month: "short" }),
    weekday: part({ weekday: "short" }),
  };
}

/** "09:00:00" -> "09:00" */
export function formatTime(time: string): string {
  return time.slice(0, 5);
}
