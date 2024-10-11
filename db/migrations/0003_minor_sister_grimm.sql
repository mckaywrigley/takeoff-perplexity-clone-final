ALTER TABLE "sources" RENAME COLUMN "snippet" TO "text";--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "summary" text;