CREATE TABLE "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor" text NOT NULL,
	"action" text NOT NULL,
	"summary" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limit" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"count" integer NOT NULL,
	"last_request" bigint NOT NULL,
	CONSTRAINT "rate_limit_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "matches" DROP CONSTRAINT "matches_status_check";--> statement-breakpoint
ALTER TABLE "site_config" ADD COLUMN "rank_points" text;--> statement-breakpoint
CREATE INDEX "audit_log_at_idx" ON "audit_log" USING btree ("at");--> statement-breakpoint
ALTER TABLE "score_points" DROP COLUMN "reason";--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_status_check" CHECK ("matches"."status" in ('scheduled', 'in_progress', 'completed', 'postponed', 'cancelled'));