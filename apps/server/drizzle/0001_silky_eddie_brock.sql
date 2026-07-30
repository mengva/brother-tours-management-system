ALTER TABLE "users" ALTER COLUMN "permissions" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "permissions" SET DEFAULT '{}'::text;--> statement-breakpoint
DROP TYPE "public"."user_permission";--> statement-breakpoint
CREATE TYPE "public"."user_permission" AS ENUM('Create', 'Read', 'Update', 'Delete', 'Rollback');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "permissions" SET DEFAULT '{}'::"public"."user_permission"[];--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "permissions" SET DATA TYPE "public"."user_permission"[] USING "permissions"::"public"."user_permission"[];