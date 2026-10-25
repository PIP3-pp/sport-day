import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { MATCH_FORMATS, MATCH_STATUSES } from "../lib/match-constants";

// Timestamps and dates are read as strings so query results stay
// JSON-serializable for the Next.js data cache.
const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
};

export {
  MATCH_FORMATS,
  MATCH_STATUSES,
  type MatchFormat,
  type MatchStatus,
} from "../lib/match-constants";

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  color: text("color").notNull(),
  logoUrl: text("logo_url"),
  description: text("description"),
  slogan: text("slogan"),
  ...timestamps,
});

export const sports = pgTable("sports", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

export const matches = pgTable(
  "matches",
  {
    id: serial("id").primaryKey(),
    sportId: integer("sport_id")
      .notNull()
      .references(() => sports.id, { onDelete: "restrict" }),
    date: date("date", { mode: "string" }).notNull(),
    startTime: time("start_time").notNull(),
    round: text("round").notNull(),
    format: text("format", { enum: MATCH_FORMATS }).notNull().default("versus"),
    teamAId: integer("team_a_id").references(() => teams.id, {
      onDelete: "restrict",
    }),
    teamBId: integer("team_b_id").references(() => teams.id, {
      onDelete: "restrict",
    }),
    status: text("status", { enum: MATCH_STATUSES })
      .notNull()
      .default("scheduled"),
    ...timestamps,
  },
  (t) => [
    index("matches_date_idx").on(t.date),
    index("matches_status_idx").on(t.status),
    check(
      "matches_status_check",
      sql`${t.status} in ('scheduled', 'in_progress', 'completed', 'postponed', 'cancelled')`,
    ),
    check(
      "matches_teams_check",
      sql`(${t.format} = 'versus' and ${t.teamAId} is not null and ${t.teamBId} is not null and ${t.teamAId} <> ${t.teamBId})
        or (${t.format} = 'all_teams' and ${t.teamAId} is null and ${t.teamBId} is null)`,
    ),
  ],
);

export const results = pgTable(
  "results",
  {
    id: serial("id").primaryKey(),
    matchId: integer("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "restrict" }),
    score: integer("score"),
    position: integer("position"),
    ...timestamps,
  },
  (t) => [
    index("results_match_id_idx").on(t.matchId),
    // One result row per team per match: blocks duplicate submissions.
    uniqueIndex("results_match_team_unique").on(t.matchId, t.teamId),
  ],
);

export const scorePoints = pgTable(
  "score_points",
  {
    id: serial("id").primaryKey(),
    matchId: integer("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "restrict" }),
    points: integer("points").notNull(),
    createdAt: timestamps.createdAt,
  },
  (t) => [
    index("score_points_team_id_idx").on(t.teamId),
    uniqueIndex("score_points_match_team_unique").on(t.matchId, t.teamId),
  ],
);

export const highlights = pgTable(
  "highlights",
  {
    id: serial("id").primaryKey(),
    date: date("date", { mode: "string" }).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    matchId: integer("match_id").references(() => matches.id, {
      onDelete: "set null",
    }),
    isActive: boolean("is_active").notNull().default(false),
    ...timestamps,
  },
  (t) => [
    index("highlights_date_idx").on(t.date),
    // Only one active highlight per date.
    uniqueIndex("highlights_active_date_unique")
      .on(t.date)
      .where(sql`${t.isActive}`),
  ],
);

export const announcements = pgTable(
  "announcements",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    attachmentUrl: text("attachment_url"),
    attachmentType: text("attachment_type"),
    attachmentName: text("attachment_name"),
    publishedAt: date("published_at", { mode: "string" }).notNull(),
    isPublished: boolean("is_published").notNull().default(false),
    ...timestamps,
  },
  (t) => [index("announcements_published_at_idx").on(t.publishedAt)],
);

// When and where each team practices a sport. A team may have several slots per sport.
export const practiceSessions = pgTable(
  "practice_sessions",
  {
    id: serial("id").primaryKey(),
    sportId: integer("sport_id")
      .notNull()
      .references(() => sports.id, { onDelete: "restrict" }),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "restrict" }),
    // Free text such as "จันทร์–ศุกร์" or "21–23 ต.ค.".
    days: text("days").notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    location: text("location").notNull(),
    note: text("note"),
    ...timestamps,
  },
  (t) => [
    index("practice_sessions_sport_id_idx").on(t.sportId),
    check("practice_sessions_time_check", sql`${t.endTime} > ${t.startTime}`),
  ],
);

export const siteConfig = pgTable(
  "site_config",
  {
    id: integer("id").primaryKey().default(1),
    eventName: text("event_name").notNull(),
    eventYear: integer("event_year").notNull(),
    slogan: text("slogan").notNull().default(""),
    schoolLogoUrl: text("school_logo_url"),
    galleryDriveUrl: text("gallery_drive_url"),
    // Comma-separated points by finishing position, e.g. "30,20,10,5". Pre-fills the result form.
    rankPoints: text("rank_points"),
    // Uploaded cover image/video for the home page; null uses /banner.webp.
    bannerUrl: text("banner_url"),
    // Which public sections and pages are shown; see lib/visibility.ts.
    visibility: jsonb("visibility"),
    ...timestamps,
  },
  (t) => [check("site_config_single_row", sql`${t.id} = 1`)],
);

// Who changed what in the admin. Append-only; no foreign keys so history
// survives deleted rows.
export const auditLog = pgTable(
  "audit_log",
  {
    id: serial("id").primaryKey(),
    at: timestamp("at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    actor: text("actor").notNull(),
    action: text("action").notNull(),
    summary: text("summary").notNull(),
  },
  (t) => [index("audit_log_at_idx").on(t.at)],
);

// --- Better Auth tables (admin accounts and sessions only) ---

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Login rate limiting (Better Auth `rateLimit.storage: "database"`), so the
// counters are shared across serverless instances.
export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

// --- Relations ---

export const matchesRelations = relations(matches, ({ one, many }) => ({
  sport: one(sports, { fields: [matches.sportId], references: [sports.id] }),
  teamA: one(teams, {
    fields: [matches.teamAId],
    references: [teams.id],
    relationName: "teamA",
  }),
  teamB: one(teams, {
    fields: [matches.teamBId],
    references: [teams.id],
    relationName: "teamB",
  }),
  results: many(results),
  scorePoints: many(scorePoints),
}));

export const resultsRelations = relations(results, ({ one }) => ({
  match: one(matches, { fields: [results.matchId], references: [matches.id] }),
  team: one(teams, { fields: [results.teamId], references: [teams.id] }),
}));

export const scorePointsRelations = relations(scorePoints, ({ one }) => ({
  match: one(matches, {
    fields: [scorePoints.matchId],
    references: [matches.id],
  }),
  team: one(teams, { fields: [scorePoints.teamId], references: [teams.id] }),
}));

export const practiceSessionsRelations = relations(practiceSessions, ({ one }) => ({
  sport: one(sports, { fields: [practiceSessions.sportId], references: [sports.id] }),
  team: one(teams, { fields: [practiceSessions.teamId], references: [teams.id] }),
}));

export const highlightsRelations = relations(highlights, ({ one }) => ({
  match: one(matches, {
    fields: [highlights.matchId],
    references: [matches.id],
  }),
}));
