CREATE TABLE "practice_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"sport_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"days" text NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"location" text NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "practice_sessions_time_check" CHECK ("practice_sessions"."end_time" > "practice_sessions"."start_time")
);
--> statement-breakpoint
ALTER TABLE "site_config" ADD COLUMN "banner_url" text;--> statement-breakpoint
ALTER TABLE "site_config" ADD COLUMN "visibility" jsonb;--> statement-breakpoint
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "practice_sessions_sport_id_idx" ON "practice_sessions" USING btree ("sport_id");