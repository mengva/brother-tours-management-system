import { relations } from 'drizzle-orm';
import {
    pgTable,
    text,
    varchar,
    timestamp,
    integer,
    numeric,
    boolean,
    pgEnum,
    uuid,
    index,
    date,
} from 'drizzle-orm/pg-core';

// ==========================================
// 1. ENUMS (Role & Status Management)
// ==========================================

export const userRoleEnum = pgEnum('role', [
    'Admin',
    'Sales',
    'Viewer',
    'Customer',
    'Supplier'
]);

export const enquiryStatusEnum = pgEnum('enquiry_status', [
    'NewEnquiry',
    'Reviewing',
    'ProposalSent',
    'FollowUp',
    'Confirmed',
    'Lost',
]);

export const userPermissionEnum = pgEnum("user_permission", [
    "Create",
    "Read",
    "Update",
    "Delete",
    "Rollback",
]);

export const currencyEnum = pgEnum('currency', [
    "USD",
    "LAK",
    "THB"
]);

export const imageTypeEnum = pgEnum("image_type", [
    // --- User & Identity Documents ---
    "Profile",
    "Cover",
    "Passport",
    "IdentityCard",
    "Census",
    "Document",

    // --- Tour & Marketing (New Features) ---
    "TourBanner",       // ຮູບ Banner ທົວ
    "TourGallery",      // ຮູບແກເລີຣີຂອງທົວ
    "CategoryIcon",     // ຮູບ/ໄອຄອນ ປະເພດທົວ

    // --- Booking, Financial & Sales ---
    "PaymentSlip",      // ໃບໂອນ/Slip ໂອນເງິນມັດຈຳ
    "Contract",          // ສັນຍາການຈອງ/ສັນຍາ Supplier
    "Itinerary",         // ຮູບສະຖານທີ່ທ່ອງທ່ຽວໃນແຜນການທົວ

    // --- Supplier & Accommodation ---
    "Room",              // ຮູບໂຮງແຮມ/ຮ້ອງພັກ
    "Vehicle",           // ຮູບລົດ/ເຮືອ/ພາຫະນະ
    "Activity",          // ຮູບກິດຈະກຳ

    // --- Fallback ---
    "Other"
]);

export const paymentStatusEnum = pgEnum('payment_status', [
    'Unpaid',
    'DepositPaid',
    'FullyPaid',
    'Refunded',
]);

export const supplierTypeEnum = pgEnum('supplier_type', [
    'Hotel',
    'Guide',
    'Driver',
    'Boat',
    'Restaurant',
    'Activity',
]);

export const unitTypeEnum = pgEnum('unit_type', [
    'PerPerson',
    'PerRoom',
    'PerVehicle',
    'PerDay',
    'PerGroup',
]);

export const availabilityStatusEnum = pgEnum('availability_status', [
    'Available',
    'Limited',
    'Unavailable',
]);

// ==========================================
// 2. USERS & AUTHENTICATION
// ==========================================

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: varchar("full_name", { length: 150 }).notNull(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }).unique().notNull(),
    gender: varchar("gender", { length: 20 }),

    isActive: boolean("is_active").default(true).notNull(),
    role: userRoleEnum("role").notNull(),
    permissions: userPermissionEnum("permissions").array().default([]),

    userAgent: varchar("user_agent", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
    index("users_active_idx").on(table.isActive),
    index("users_role_idx").on(table.role),
]);

export const customers = pgTable('customers', {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),

    fullName: varchar("full_name", { length: 150 }).notNull(),
    whatsappNumber: varchar("whatsapp_number", { length: 30 }).unique().notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }).unique().notNull(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    gender: varchar("gender", { length: 20 }),
    birthDay: date("birth_day"),

    village: varchar("village", { length: 150 }),
    district: varchar("district", { length: 150 }),
    province: varchar("province", { length: 150 }),

    passportNumber: varchar("passport_number", { length: 100 }),
    passportExpiryDate: date("passport_expiry_date"),
    identityCardNumber: varchar("identity_card_number", { length: 100 }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
    index("customers_email_idx").on(table.email),
    index("customers_phone_idx").on(table.phoneNumber),
]);

export const suppliers = pgTable('suppliers', {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
    name: text('name').notNull(),
    type: supplierTypeEnum('type').notNull(),
    destination: text('destination').notNull(),
    contactPerson: text('contact_person'),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
});

export const userCredentials = pgTable("user_credentials", {
    userId: uuid("user_id").primaryKey().notNull().references(() => users.id, { onDelete: "cascade" }),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
});

// ==========================================
// 3. NEW TABLES: TOUR CATEGORIES & TOURS (ເພີ່ມໃໝ່)
// ==========================================

// --- Table (Tour Categories) ---
export const tourCategories = pgTable('tour_categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(), // e.g. "Cultural", "Adventure", "Relaxation"
    slug: varchar('slug', { length: 120 }).notNull().unique(), // e.g. "cultural-tours" ສຳລັບ URL
    description: text('description'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("tour_categories_slug_idx").on(table.slug),
]);

// --- Table (Tour Packages / Master Tours) ---
export const tours = pgTable('tours', {
    id: uuid('id').defaultRandom().primaryKey(),
    categoryId: uuid('category_id').references(() => tourCategories.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(), // URL-friendly (e.g. "luang-prabang-3d2n")
    summary: text('summary'), // ສັງເຂບຫຍໍ້ສຳລັບ Card ໃນ Landing Page
    description: text('description'), // ລາຍລະອຽດເຕັມ
    destination: varchar('destination', { length: 150 }).notNull(), // e.g. "Luang Prabang", "Vang Vieng"
    durationDays: integer('duration_days').notNull(),
    durationNights: integer('duration_nights').notNull(),

    // Pricing
    basePrice: numeric('base_price', { precision: 12, scale: 2 }).notNull(), // ລາຄາເລີ່ມຕົ້ນ
    currency: varchar('currency', { length: 3 }).default('USD').notNull(),

    // Status flags
    isFeatured: boolean('is_featured').default(false).notNull(), // ໂຊໃນ Hero/Recommended Section ຂອງ Landing Page
    isActive: boolean('is_active').default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("tours_category_id_idx").on(table.categoryId),
    index("tours_slug_idx").on(table.slug),
    index("tours_is_featured_idx").on(table.isFeatured),
]);

// --- Table (Tour Itineraries) ---
export const tourItineraries = pgTable('tour_itineraries', {
    id: uuid('id').defaultRandom().primaryKey(),
    tourId: uuid('tour_id').references(() => tours.id, { onDelete: 'cascade' }).notNull(),
    dayNumber: integer('day_number').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    meals: text('meals'), // e.g. "B, L, D"
    accommodation: text('accommodation'),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("tour_itineraries_tour_id_idx").on(table.tourId),
]);

// ==========================================
// 4. IMAGES (Updated with tourId)
// ==========================================

export const images = pgTable("images", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    supplierId: uuid("supplier_id").references(() => suppliers.id, { onDelete: "cascade" }),
    tourId: uuid("tour_id").references(() => tours.id, { onDelete: "cascade" }), //  ເພີ່ມ tourId
    categoryId: uuid("category_id").references(() => tourCategories.id, { onDelete: "cascade" }), //  ເພີ່ມ categoryId
    itineraryId: uuid("itinerary_id").references(() => tourItineraries.id, { onDelete: "cascade" }),
    bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    imageKey: text("image_key").notNull(),
    width: integer("width"),
    height: integer("height"),
    size: integer("size").notNull(),
    type: imageTypeEnum("type").default("Profile").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
    index("images_user_id_idx").on(table.userId),
    index("images_tour_id_idx").on(table.tourId),
    index("images_booking_id_idx").on(table.bookingId),
    index("images_type_idx").on(table.type),
]);

// ==========================================
// 5. ENQUIRIES & BOOKINGS (Updated References)
// ==========================================

export const enquiries = pgTable('enquiries', {
    id: uuid('id').defaultRandom().primaryKey(),
    customerId: uuid('customer_id')
        .references(() => customers.id, { onDelete: 'cascade' }) // ແກ້ Foreign Key ໄປຫາ customers
        .notNull(),
    tourId: uuid('tour_id').references(() => tours.id, { onDelete: 'set null' }), //  ເພີ່ມ Tour Reference (ຖ້າລູກຄ້າເລືອກຈາກ Landing Page)
    assignedStaffId: uuid('assigned_staff_id').references(() => users.id),
    status: enquiryStatusEnum('status').default("NewEnquiry").notNull(),
    travellerCount: integer('traveller_count').default(1).notNull(),
    travelStartDate: timestamp('travel_start_date'),
    travelEndDate: timestamp('travel_end_date'),
    specialRequests: text('special_requests'),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("enquiries_customer_id_idx").on(table.customerId),
    index("enquiries_tour_id_idx").on(table.tourId),
    index("enquiries_status_idx").on(table.status),
]);

export const itineraries = pgTable('itineraries', {
    id: uuid('id').defaultRandom().primaryKey(),
    enquiryId: uuid('enquiry_id')
        .references(() => enquiries.id, { onDelete: 'cascade' })
        .notNull(),
    dayNumber: integer('day_number').notNull(),
    destination: text('destination').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    accommodation: text('accommodation'),
    meals: text('meals'),
    activities: text('activities'),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("itineraries_enquiry_id_idx").on(table.enquiryId),
]);

export const bookings = pgTable('bookings', {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingRef: varchar('booking_ref', { length: 20 }).notNull().unique(),
    enquiryId: uuid('enquiry_id').references(() => enquiries.id),
    tourId: uuid('tour_id').references(() => tours.id), //  ເພີ່ມ tourId
    customerId: uuid('customer_id')
        .references(() => customers.id) // ແກ້ Foreign Key ໄປຫາ customers
        .notNull(),
    assignedStaffId: uuid('assigned_staff_id')
        .references(() => users.id)
        .notNull(),
    tourTitle: text('tour_title').notNull(),
    travellerCount: integer('traveller_count').notNull(),
    travelStartDate: timestamp('travel_start_date').notNull(),
    travelEndDate: timestamp('travel_end_date').notNull(),

    // Financial Data
    totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
    depositAmount: numeric('deposit_amount', { precision: 12, scale: 2 }).default('0').notNull(),
    outstandingBalance: numeric('outstanding_balance', { precision: 12, scale: 2 }).notNull(),
    paymentStatus: paymentStatusEnum('payment_status').default("Unpaid").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("booking_enquiry_id_idx").on(table.enquiryId),
    index("booking_tour_id_idx").on(table.tourId),
    index("booking_booking_ref_idx").on(table.bookingRef),
    index("booking_customer_id_idx").on(table.customerId),
    index("booking_assigned_staff_id_idx").on(table.assignedStaffId),
    index("booking_payment_status_idx").on(table.paymentStatus),
]);

// ==========================================
// 6. SUPPLIERS, RATES & AUDIT LOGS
// ==========================================

export const serviceRates = pgTable('service_rates', {
    id: uuid('id').defaultRandom().primaryKey(),
    supplierId: uuid('supplier_id')
        .references(() => suppliers.id, { onDelete: 'cascade' }) // ແກ້ Foreign Key ໄປຫາ suppliers
        .notNull(),
    serviceName: text('service_name').notNull(),
    unitType: unitTypeEnum('unit_type').notNull(),
    cost: numeric('cost', { precision: 12, scale: 2 }).notNull(),
    currency: currencyEnum('currency').notNull(),
    validFrom: timestamp('valid_from').notNull(),
    validUntil: timestamp('valid_until').notNull(),
    minGroupSize: integer('min_group_size').default(1),
    maxGroupSize: integer('max_group_size'),
    notes: text('notes'),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("service_rate_supplier_id_idx").on(table.supplierId),
]);

export const supplierAvailability = pgTable('supplier_availability', {
    id: uuid('id').defaultRandom().primaryKey(),
    supplierId: uuid('supplier_id')
        .references(() => suppliers.id, { onDelete: 'cascade' }) // ແກ້ Foreign Key ໄປຫາ suppliers
        .notNull(),
    date: timestamp('date').notNull(),
    status: availabilityStatusEnum('status').default("Available").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("supplier_availability_supplier_id_idx").on(table.supplierId),
    index("supplier_availability_status_idx").on(table.status),
]);

export const priceHistories = pgTable('price_histories', {
    id: uuid('id').defaultRandom().primaryKey(),
    serviceRateId: uuid('service_rate_id')
        .references(() => serviceRates.id, { onDelete: 'cascade' })
        .notNull(),
    oldPrice: numeric('old_price', { precision: 12, scale: 2 }).notNull(),
    newPrice: numeric('new_price', { precision: 12, scale: 2 }).notNull(),
    changedByUserId: uuid('changed_by_user_id')
        .references(() => users.id)
        .notNull(),
    changeReason: text('change_reason').notNull(),
    isSuspicious: boolean('is_suspicious').default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("price_histories_service_rate_id_idx").on(table.serviceRateId),
    index("price_histories_change_by_user_id_idx").on(table.changedByUserId),
]);

// ==========================================
// 7. DRIZZLE RELATIONS DEFINITION
// ==========================================

export const tourCategoriesRelations = relations(tourCategories, ({ many, one }) => ({
    tours: many(tours),
    images: many(images),
}));

export const toursRelations = relations(tours, ({ one, many }) => ({
    category: one(tourCategories, {
        fields: [tours.categoryId],
        references: [tourCategories.id],
    }),
    tourItineraries: many(tourItineraries),
    images: many(images),
    enquiries: many(enquiries),
    bookings: many(bookings),
}));

export const tourItinerariesRelations = relations(tourItineraries, ({ one }) => ({
    tour: one(tours, {
        fields: [tourItineraries.tourId],
        references: [tours.id],
    }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
    credentials: one(userCredentials, {
        fields: [users.id],
        references: [userCredentials.userId],
    }),
    createdSuppliers: many(suppliers, { relationName: "staff_created_suppliers" }),
    supplierProfile: one(suppliers, {
        fields: [users.id],
        references: [suppliers.userId],
        relationName: "supplier_user_account",
    }),
    images: many(images),
    assignedEnquiries: many(enquiries),
    assignedBookings: many(bookings),
    priceChanges: many(priceHistories),
}));

export const userCredentialsRelations = relations(userCredentials, ({ one }) => ({
    user: one(users, {
        fields: [userCredentials.userId],
        references: [users.id],
    }),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
    user: one(users, {
        fields: [customers.userId],
        references: [users.id],
    }),
    enquiries: many(enquiries),
    bookings: many(bookings),
}));

export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
    createdBy: one(users, {
        fields: [suppliers.createdById],
        references: [users.id],
        relationName: "staff_created_suppliers",
    }),
    userAccount: one(users, {
        fields: [suppliers.userId],
        references: [users.id],
        relationName: "supplier_user_account",
    }),
    images: many(images),
    serviceRates: many(serviceRates),
    availability: many(supplierAvailability),
}));

export const imagesRelations = relations(images, ({ one }) => ({
    user: one(users, {
        fields: [images.userId],
        references: [users.id],
    }),
    supplier: one(suppliers, {
        fields: [images.supplierId],
        references: [suppliers.id],
    }),
    tour: one(tours, {
        fields: [images.tourId],
        references: [tours.id],
    }),
    category: one(tourCategories, {
        fields: [images.categoryId],
        references: [tourCategories.id],
    }),
    itinerary: one(itineraries, {
        fields: [images.itineraryId],
        references: [itineraries.id],
    }),
    booking: one(bookings, {
        fields: [images.bookingId],
        references: [bookings.id],
    }),
}));

export const enquiriesRelations = relations(enquiries, ({ one, many }) => ({
    customer: one(customers, {
        fields: [enquiries.customerId],
        references: [customers.id],
    }),
    tour: one(tours, {
        fields: [enquiries.tourId],
        references: [tours.id],
    }),
    assignedStaff: one(users, {
        fields: [enquiries.assignedStaffId],
        references: [users.id],
    }),
    itineraries: many(itineraries),
    bookings: many(bookings),
}));

export const itinerariesRelations = relations(itineraries, ({ one, many }) => ({
    enquiry: one(enquiries, {
        fields: [itineraries.enquiryId],
        references: [enquiries.id],
    }),
    images: many(images),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
    customer: one(customers, {
        fields: [bookings.customerId],
        references: [customers.id],
    }),
    tour: one(tours, {
        fields: [bookings.tourId],
        references: [tours.id],
    }),
    assignedStaff: one(users, {
        fields: [bookings.assignedStaffId],
        references: [users.id],
    }),
    enquiry: one(enquiries, {
        fields: [bookings.enquiryId],
        references: [enquiries.id],
    }),
    images: many(images),
}));

export const serviceRatesRelations = relations(serviceRates, ({ one, many }) => ({
    supplier: one(suppliers, {
        fields: [serviceRates.supplierId],
        references: [suppliers.id],
    }),
    priceHistories: many(priceHistories),
}));

export const supplierAvailabilityRelations = relations(supplierAvailability, ({ one }) => ({
    supplier: one(suppliers, {
        fields: [supplierAvailability.supplierId],
        references: [suppliers.id],
    }),
}));

export const priceHistoriesRelations = relations(priceHistories, ({ one }) => ({
    serviceRate: one(serviceRates, {
        fields: [priceHistories.serviceRateId],
        references: [serviceRates.id],
    }),
    changedBy: one(users, {
        fields: [priceHistories.changedByUserId],
        references: [users.id],
    }),
}));

// export type Role = 'ADMIN' | 'SALES' | 'VIEWER';

// export type Action = 'create' | 'read' | 'update' | 'delete' | 'rollback';
// export type Resource = 'enquiries' | 'bookings' | 'suppliers' | 'users' | 'audit_logs';

// /**
//  * Permissions Matrix Table
//  */
// const PERMISSIONS: Record<Role, Record<Resource, Action[]>> = {
//   ADMIN: {
//     enquiries: ['create', 'read', 'update', 'delete'],
//     bookings: ['create', 'read', 'update', 'delete'],
//     suppliers: ['create', 'read', 'update', 'delete'],
//     users: ['create', 'read', 'update', 'delete'],
//     audit_logs: ['read', 'rollback'], // Admin ເທົ່ານັ້ນທີ່ Restore/Rollback ລາຄາໄດ້
//   },
//   SALES: {
//     enquiries: ['create', 'read', 'update'],
//     bookings: ['create', 'read', 'update'],
//     suppliers: ['create', 'read', 'update'],
//     users: [], // Sales ຈັດການ Users ບໍ່ໄດ້
//     audit_logs: ['read'], // ເບິ່ງໄດ້ ແຕ່ Rollback ບໍ່ໄດ້
//   },
//   VIEWER: {
//     enquiries: ['read'],
//     bookings: ['read'],
//     suppliers: ['read'],
//     users: [],
//     audit_logs: [],
//   },
// };

// /**
//  * Check if a role has permission to perform an action on a resource
//  */
// export function hasPermission(role: Role, resource: Resource, action: Action): boolean {
//   const allowedActions = PERMISSIONS[role]?.[resource] || [];
//   return allowedActions.includes(action);
// }

// /**
//  * Helper strictly for checking if user is read-only (Viewer)
//  */
// export function isReadOnly(role: Role): boolean {
//   return role === 'VIEWER';
// }