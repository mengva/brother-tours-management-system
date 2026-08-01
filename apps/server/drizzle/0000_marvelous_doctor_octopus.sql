CREATE TYPE "public"."payment_status" AS ENUM('Unpaid', 'Partially_Paid', 'Paid', 'Refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_tx_status" AS ENUM('Pending', 'Success', 'Failed', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('Deposit', 'Final_Balance', 'Full_Payment', 'Refund');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('Draft', 'Sent', 'Paid', 'Partially_Paid', 'Overdue', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."enquiry_status" AS ENUM('NewEnquiry', 'Reviewing', 'ProposalSent', 'FollowUp', 'Confirmed', 'Lost');--> statement-breakpoint
CREATE TYPE "public"."image_type" AS ENUM('Profile', 'Cover', 'Passport', 'IdentityCard', 'Census', 'Document', 'TourBanner', 'TourGallery', 'CategoryIcon', 'PaymentSlip', 'FullPaymentSlip', 'FinalBalanceSlip', 'Contract', 'Itinerary', 'Room', 'Vehicle', 'Activity', 'Other');--> statement-breakpoint
CREATE TYPE "public"."currency" AS ENUM('USD', 'LAK', 'THB');--> statement-breakpoint
CREATE TYPE "public"."unit_type" AS ENUM('PerPerson', 'PerRoom', 'PerVehicle', 'PerDay', 'PerGroup');--> statement-breakpoint
CREATE TYPE "public"."supplier_type" AS ENUM('Hotel', 'Guide', 'Driver', 'Boat', 'Restaurant', 'Activity');--> statement-breakpoint
CREATE TYPE "public"."availability_status" AS ENUM('Available', 'Limited', 'Unavailable');--> statement-breakpoint
CREATE TYPE "public"."user_permission" AS ENUM('Create', 'Read', 'Update', 'Delete', 'Rollback');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Admin', 'Sales', 'Viewer', 'Customer', 'Supplier');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_ref" varchar(20) NOT NULL,
	"enquiry_id" uuid,
	"tour_id" uuid,
	"customer_id" uuid NOT NULL,
	"assigned_staff_id" uuid,
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
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"tour_id" uuid,
	"invoice_id" uuid,
	"customer_id" uuid NOT NULL,
	"staff_id" uuid,
	"payment_no" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"payment_type" "payment_type" DEFAULT 'Full_Payment' NOT NULL,
	"payment_method" text NOT NULL,
	"status" "payment_tx_status" DEFAULT 'Pending' NOT NULL,
	"notes" text,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_payment_no_unique" UNIQUE("payment_no")
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_no" text NOT NULL,
	"booking_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"issued_by_id" uuid,
	"tour_id" uuid,
	"subtotal" numeric(12, 2) NOT NULL,
	"tax_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"discount_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"paid_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"due_amount" numeric(12, 2) NOT NULL,
	"status" "invoice_status" DEFAULT 'Draft' NOT NULL,
	"issue_date" timestamp with time zone DEFAULT now() NOT NULL,
	"due_date" timestamp with time zone NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_invoice_no_unique" UNIQUE("invoice_no")
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
	"tour_id" uuid,
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
	"tour_id" uuid,
	"category_id" uuid,
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
	"currency" "currency" NOT NULL,
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
	"child_price" numeric(12, 2),
	"infant_price" numeric(12, 2),
	"discount_price" numeric(12, 2),
	"single_supplement_price" numeric(12, 2),
	"cost_price" numeric(12, 2),
	"currency" "currency" NOT NULL,
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
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_assigned_staff_id_users_id_fk" FOREIGN KEY ("assigned_staff_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_staff_id_users_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_issued_by_id_users_id_fk" FOREIGN KEY ("issued_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_staff_id_users_id_fk" FOREIGN KEY ("assigned_staff_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_category_id_tour_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."tour_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_itinerary_id_tour_itineraries_id_fk" FOREIGN KEY ("itinerary_id") REFERENCES "public"."tour_itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_histories" ADD CONSTRAINT "price_histories_service_rate_id_service_rates_id_fk" FOREIGN KEY ("service_rate_id") REFERENCES "public"."service_rates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_histories" ADD CONSTRAINT "price_histories_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_rates" ADD CONSTRAINT "service_rates_supplier_id_users_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_availability" ADD CONSTRAINT "supplier_availability_supplier_id_users_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tours" ADD CONSTRAINT "tours_category_id_tour_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."tour_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_itineraries" ADD CONSTRAINT "tour_itineraries_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "booking_enquiry_id_idx" ON "bookings" USING btree ("enquiry_id");--> statement-breakpoint
CREATE INDEX "booking_tour_id_idx" ON "bookings" USING btree ("tour_id");--> statement-breakpoint
CREATE INDEX "booking_booking_ref_idx" ON "bookings" USING btree ("booking_ref");--> statement-breakpoint
CREATE INDEX "booking_customer_id_idx" ON "bookings" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "booking_assigned_staff_id_idx" ON "bookings" USING btree ("assigned_staff_id");--> statement-breakpoint
CREATE INDEX "booking_payment_status_idx" ON "bookings" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "payments_booking_id_idx" ON "payments" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "payments_tour_id_idx" ON "payments" USING btree ("tour_id");--> statement-breakpoint
CREATE INDEX "payments_invoice_id_idx" ON "payments" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "payments_customer_id_idx" ON "payments" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "payments_staff_id_idx" ON "payments" USING btree ("staff_id");--> statement-breakpoint
CREATE INDEX "payments_payment_no_idx" ON "payments" USING btree ("payment_no");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payments_payment_type_idx" ON "payments" USING btree ("payment_type");--> statement-breakpoint
CREATE INDEX "invoices_booking_id_idx" ON "invoices" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "invoices_customer_id_idx" ON "invoices" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "invoices_issued_by_id_idx" ON "invoices" USING btree ("issued_by_id");--> statement-breakpoint
CREATE INDEX "invoices_tour_id_idx" ON "invoices" USING btree ("tour_id");--> statement-breakpoint
CREATE INDEX "invoices_status_idx" ON "invoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "customers_email_idx" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "customers_phone_idx" ON "customers" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX "enquiries_customer_id_idx" ON "enquiries" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "enquiries_tour_id_idx" ON "enquiries" USING btree ("tour_id");--> statement-breakpoint
CREATE INDEX "enquiries_status_idx" ON "enquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "images_user_id_idx" ON "images" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "images_tour_id_idx" ON "images" USING btree ("tour_id");--> statement-breakpoint
CREATE INDEX "images_booking_id_idx" ON "images" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "images_supplier_id_idx" ON "images" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "images_category_id_idx" ON "images" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "images_itinerary_id_idx" ON "images" USING btree ("itinerary_id");--> statement-breakpoint
CREATE INDEX "images_type_idx" ON "images" USING btree ("type");--> statement-breakpoint
CREATE INDEX "itineraries_enquiry_id_idx" ON "itineraries" USING btree ("enquiry_id");--> statement-breakpoint
CREATE INDEX "price_histories_service_rate_id_idx" ON "price_histories" USING btree ("service_rate_id");--> statement-breakpoint
CREATE INDEX "price_histories_change_by_user_id_idx" ON "price_histories" USING btree ("changed_by_user_id");--> statement-breakpoint
CREATE INDEX "service_rate_supplier_id_idx" ON "service_rates" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "supplier_availability_supplier_id_idx" ON "supplier_availability" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "supplier_availability_status_idx" ON "supplier_availability" USING btree ("status");--> statement-breakpoint
CREATE INDEX "users_active_idx" ON "users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "tours_category_id_idx" ON "tours" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "tours_slug_idx" ON "tours" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tours_is_featured_idx" ON "tours" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "tour_categories_slug_idx" ON "tour_categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tour_itineraries_tour_id_idx" ON "tour_itineraries" USING btree ("tour_id");