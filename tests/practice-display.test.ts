import { describe, expect, it } from "vitest";
import { bannerKind, isAllowedBannerUrl } from "@/lib/banner";
import { practiceSchema } from "@/lib/validations";
import { DEFAULT_VISIBILITY, hiddenPages, parseVisibility } from "@/lib/visibility";

const validPractice = {
  sportId: "1",
  teamId: "2",
  days: "จันทร์–ศุกร์",
  startTime: "16:00",
  endTime: "17:30",
  location: "สนามฟุตบอล",
};

describe("practiceSchema", () => {
  it("accepts a valid practice slot", () => {
    expect(practiceSchema.safeParse(validPractice).success).toBe(true);
  });

  it("rejects an end time before the start time", () => {
    const result = practiceSchema.safeParse({ ...validPractice, endTime: "15:00" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["endTime"]);
  });

  it("requires a team and a location", () => {
    const result = practiceSchema.safeParse({ ...validPractice, teamId: "", location: " " });
    expect(result.error?.issues.map((i) => i.path[0]).sort()).toEqual(["location", "teamId"]);
  });
});

describe("visibility", () => {
  it("closes the match schedule by default and opens practice", () => {
    expect(DEFAULT_VISIBILITY.schedulePage).toBe(false);
    expect(DEFAULT_VISIBILITY.practicePage).toBe(true);
    expect(hiddenPages(DEFAULT_VISIBILITY)).toEqual(["/schedule"]);
  });

  it("overrides defaults with stored booleans and ignores junk", () => {
    const parsed = parseVisibility({ schedulePage: true, banner: false, bogus: true, hero: "no" });
    expect(parsed.schedulePage).toBe(true);
    expect(parsed.banner).toBe(false);
    expect(parsed.hero).toBe(true);
    expect("bogus" in parsed).toBe(false);
  });

  it("falls back to defaults for a missing value", () => {
    expect(parseVisibility(null)).toEqual(DEFAULT_VISIBILITY);
  });
});

describe("banner", () => {
  it("accepts supported files in the Blob store only", () => {
    const blob = "https://abc.public.blob.vercel-storage.com/banner/cover-x1.mov";
    expect(isAllowedBannerUrl(blob)).toBe(true);
    expect(isAllowedBannerUrl(blob.replace(".mov", ".svg"))).toBe(true);
    expect(isAllowedBannerUrl(blob.replace(".mov", ".exe"))).toBe(false);
    expect(isAllowedBannerUrl("https://evil.example.com/banner/cover.png")).toBe(false);
    expect(isAllowedBannerUrl("http://abc.public.blob.vercel-storage.com/a.png")).toBe(false);
  });

  it("tells videos from images", () => {
    expect(bannerKind("https://x.public.blob.vercel-storage.com/banner/a.MOV")).toBe("video");
    expect(bannerKind("/banner.webp")).toBe("image");
  });
});
