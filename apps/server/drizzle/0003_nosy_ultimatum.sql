CREATE TYPE "public"."currency" AS ENUM('USD', 'LAK', 'THB');--> statement-breakpoint
ALTER TABLE "service_rates" ALTER COLUMN "currency" SET DATA TYPE "public"."currency" USING "currency"::"public"."currency";--> statement-breakpoint
ALTER TABLE "service_rates" ALTER COLUMN "currency" DROP DEFAULT;