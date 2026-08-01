ALTER TYPE "public"."image_type" ADD VALUE 'TourBanner' BEFORE 'PaymentSlip';--> statement-breakpoint
ALTER TYPE "public"."image_type" ADD VALUE 'TourGallery' BEFORE 'PaymentSlip';--> statement-breakpoint
ALTER TYPE "public"."image_type" ADD VALUE 'CategoryIcon' BEFORE 'PaymentSlip';--> statement-breakpoint
CREATE TABLE "tours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"title" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"summary" text,
	"description" text,
	"destination" varchar(150) NOT NULL,
	"duration_days" integer NOT NULL,
	"duration_nights" integer NOT NULL,
	"base_price" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tours_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tour_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tour_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tour_itineraries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tour_id" uuid NOT NULL,
	"day_number" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"meals" text,
	"accommodation" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_customer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "enquiries" DROP CONSTRAINT "enquiries_customer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "images" DROP CONSTRAINT "images_itinerary_id_itineraries_id_fk";
--> statement-breakpoint
DROP INDEX "images_itinerary_id_idx";--> statement-breakpoint
DROP INDEX "images_supplier_id_idx";--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "tour_id" uuid;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "tour_id" uuid;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "tour_id" uuid;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "tours" ADD CONSTRAINT "tours_category_id_tour_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."tour_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_itineraries" ADD CONSTRAINT "tour_itineraries_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tours_category_id_idx" ON "tours" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "tours_slug_idx" ON "tours" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tours_is_featured_idx" ON "tours" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "tour_categories_slug_idx" ON "tour_categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tour_itineraries_tour_id_idx" ON "tour_itineraries" USING btree ("tour_id");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_category_id_tour_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."tour_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_itinerary_id_tour_itineraries_id_fk" FOREIGN KEY ("itinerary_id") REFERENCES "public"."tour_itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "booking_tour_id_idx" ON "bookings" USING btree ("tour_id");--> statement-breakpoint
CREATE INDEX "enquiries_tour_id_idx" ON "enquiries" USING btree ("tour_id");--> statement-breakpoint
CREATE INDEX "images_tour_id_idx" ON "images" USING btree ("tour_id");