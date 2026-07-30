CREATE TYPE "public"."payment_status" AS ENUM('Unpaid', 'DepositPaid', 'FullyPaid', 'Refunded');--> statement-breakpoint
CREATE TYPE "public"."enquiry_status" AS ENUM('NewEnquiry', 'Reviewing', 'ProposalSent', 'FollowUp', 'Confirmed', 'Lost');--> statement-breakpoint
CREATE TYPE "public"."image_type" AS ENUM('Profile', 'Cover', 'Passport', 'IdentityCard', 'Census', 'Document', 'PaymentSlip', 'Contract', 'Itinerary', 'Room', 'Vehicle', 'Activity', 'Other');--> statement-breakpoint
CREATE TYPE "public"."unit_type" AS ENUM('PerPerson', 'PerRoom', 'PerVehicle', 'PerDay', 'PerGroup');--> statement-breakpoint
CREATE TYPE "public"."supplier_type" AS ENUM('Hotel', 'Guide', 'Driver', 'Boat', 'Restaurant', 'Activity');--> statement-breakpoint
CREATE TYPE "public"."availability_status" AS ENUM('Available', 'Limited', 'Unavailable');--> statement-breakpoint
CREATE TYPE "public"."user_permission" AS ENUM('Create', 'Read', 'Update', 'Delete', 'Rollback', 'ManageUsers');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Admin', 'Sales', 'Viewer', 'Customer', 'Supplier');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_ref" varchar(20) NOT NULL,
	"enquiry_id" uuid,
	"customer_id" uuid NOT NULL,
	"assigned_staff_id" uuid NOT NULL,
	"tour_title" text NOT NULL,
	"traveller_count" integer NOT NULL,
	"travel_start_date" timestamp NOT NULL,
	"travel_end_date" timestamp NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"deposit_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"outstanding_balance" numeric(12, 2) NOT NULL,
	"payment_status" "payment_status" DEFAULT 'Unpaid' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_booking_ref_unique" UNIQUE("booking_ref")
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"full_name" varchar(150) NOT NULL,
	"whatsapp_number" varchar(30) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"email" varchar(100) NOT NULL,
	"gender" varchar(20),
	"birth_day" date,
	"village" varchar(150),
	"district" varchar(150),
	"province" varchar(150),
	"passport_number" varchar(100),
	"passport_expiry_date" date,
	"identity_card_number" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customers_whatsapp_number_unique" UNIQUE("whatsapp_number"),
	CONSTRAINT "customers_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"assigned_staff_id" uuid,
	"status" "enquiry_status" DEFAULT 'NewEnquiry' NOT NULL,
	"traveller_count" integer DEFAULT 1 NOT NULL,
	"travel_start_date" timestamp,
	"travel_end_date" timestamp,
	"special_requests" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"supplier_id" uuid,
	"itinerary_id" uuid,
	"booking_id" uuid,
	"url" text NOT NULL,
	"image_key" text NOT NULL,
	"width" integer,
	"height" integer,
	"size" integer NOT NULL,
	"type" "image_type" DEFAULT 'Profile' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "itineraries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"day_number" integer NOT NULL,
	"destination" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"accommodation" text,
	"meals" text,
	"activities" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_histories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_rate_id" uuid NOT NULL,
	"old_price" numeric(12, 2) NOT NULL,
	"new_price" numeric(12, 2) NOT NULL,
	"changed_by_user_id" uuid NOT NULL,
	"change_reason" text NOT NULL,
	"is_suspicious" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" uuid NOT NULL,
	"service_name" text NOT NULL,
	"unit_type" "unit_type" NOT NULL,
	"cost" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp NOT NULL,
	"min_group_size" integer DEFAULT 1,
	"max_group_size" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"created_by_id" uuid,
	"name" text NOT NULL,
	"type" "supplier_type" NOT NULL,
	"destination" text NOT NULL,
	"contact_person" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"status" "availability_status" DEFAULT 'Available' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"gender" varchar(20),
	"is_active" boolean DEFAULT true NOT NULL,
	"role" "role" NOT NULL,
	"permissions" "user_permission"[] DEFAULT '{}',
	"user_agent" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_assigned_staff_id_users_id_fk" FOREIGN KEY ("assigned_staff_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_staff_id_users_id_fk" FOREIGN KEY ("assigned_staff_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_itinerary_id_itineraries_id_fk" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_histories" ADD CONSTRAINT "price_histories_service_rate_id_service_rates_id_fk" FOREIGN KEY ("service_rate_id") REFERENCES "public"."service_rates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_histories" ADD CONSTRAINT "price_histories_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_rates" ADD CONSTRAINT "service_rates_supplier_id_users_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_availability" ADD CONSTRAINT "supplier_availability_supplier_id_users_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "booking_enquiry_id_idx" ON "bookings" USING btree ("enquiry_id");--> statement-breakpoint
CREATE INDEX "booking_booking_ref_idx" ON "bookings" USING btree ("booking_ref");--> statement-breakpoint
CREATE INDEX "booking_customer_id_idx" ON "bookings" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "booking_assigned_staff_id_idx" ON "bookings" USING btree ("assigned_staff_id");--> statement-breakpoint
CREATE INDEX "booking_payment_status_idx" ON "bookings" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "customers_email_idx" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "customers_phone_idx" ON "customers" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX "enquiries_customer_id_idx" ON "enquiries" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "enquiries_status_idx" ON "enquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "images_user_id_idx" ON "images" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "images_booking_id_idx" ON "images" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "images_itinerary_id_idx" ON "images" USING btree ("itinerary_id");--> statement-breakpoint
CREATE INDEX "images_supplier_id_idx" ON "images" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "images_type_idx" ON "images" USING btree ("type");--> statement-breakpoint
CREATE INDEX "itineraries_enquiry_id_idx" ON "itineraries" USING btree ("enquiry_id");--> statement-breakpoint
CREATE INDEX "price_histories_service_rate_id_idx" ON "price_histories" USING btree ("service_rate_id");--> statement-breakpoint
CREATE INDEX "price_histories_change_by_user_id_idx" ON "price_histories" USING btree ("changed_by_user_id");--> statement-breakpoint
CREATE INDEX "service_rate_supplier_id_idx" ON "service_rates" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "supplier_availability_supplier_id_idx" ON "supplier_availability" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "supplier_availability_status_idx" ON "supplier_availability" USING btree ("status");--> statement-breakpoint
CREATE INDEX "users_active_idx" ON "users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");