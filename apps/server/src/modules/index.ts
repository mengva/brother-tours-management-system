import { relations } from 'drizzle-orm/_relations';
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
    jsonb,
    index,
    date,
} from 'drizzle-orm/pg-core';

// ==========================================
// 1. ENUMS (Role & Status Management)
// ==========================================

export const userRoleEnum = pgEnum('role', ['Admin', 'Sales', 'Viewer', 'Customer', 'Supplier']);

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
    "ManageUsers"
]);

export const imageTypeEnum = pgEnum("image_type", [
    // --- User & Identity Documents ---
    "Profile",
    "Cover",
    "Passport",
    "IdentityCard",
    "Census",
    "Document",

    // --- Booking, Financial & Sales (Project 1) ---
    "PaymentSlip",      // ໃບໂອນ/Slip ໂອນເງິນມັດຈຳ
    "Contract",          // ສັນຍາການຈອງ/ສັນຍາ Supplier
    "Itinerary",         // ຮູບສະຖານທີ່ທ່ອງທ່ຽວໃນແຜນການທົວ

    // --- Supplier & Accommodation (Project 2) ---
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
    phoneNumber: varchar("phone_number", { length: 20 }).unique(),
    email: varchar("email", { length: 100 }).unique(),
    gender: varchar("gender", { length: 20 }).notNull(),
    birthDay: date("birth_day").notNull(),
    village: varchar("village", { length: 150 }).notNull(),
    district: varchar("district", { length: 150 }).notNull(),
    province: varchar("province", { length: 150 }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    passportNumber: varchar("passport_number", { length: 100 }),
    identityCardNumber: varchar("identity_card_number", { length: 100 }),
    role: userRoleEnum("role").notNull(),
    permissions: userPermissionEnum("permissions").array().notNull(),
    userAgent: varchar("user_agent", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
    index("users_active_idx").on(table.isActive),
    index("users_role_idx").on(table.role),
]);

export const customers = pgTable('customers', {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
});

export const suppliers = pgTable('suppliers', {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
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

export const images = pgTable("images", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    supplierId: uuid("supplier_id").references(() => suppliers.id, { onDelete: "cascade" }),
    itineraryId: uuid("itinerary_id").references(() => itineraries.id, { onDelete: "cascade" }),
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
    index("images_booking_id_idx").on(table.bookingId),
    index("images_itinerary_id_idx").on(table.itineraryId),
    index("images_supplier_id_idx").on(table.supplierId),
    index("images_type_idx").on(table.type),
]);

// ==========================================
// 3. PROJECT 1: CUSTOMER, ENQUIRY & BOOKING
// ==========================================

export const enquiries = pgTable('enquiries', {
    id: uuid('id').defaultRandom().primaryKey(),
    customerId: uuid('customer_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    assignedStaffId: uuid('assigned_staff_id').references(() => users.id),
    status: enquiryStatusEnum('status').default("NewEnquiry").notNull(),
    travellerCount: integer('traveller_count').default(1).notNull(),
    travelStartDate: timestamp('travel_start_date'),
    travelEndDate: timestamp('travel_end_date'),
    specialRequests: text('special_requests'),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
});

export const itineraries = pgTable('itineraries', {
    id: uuid('id').defaultRandom().primaryKey(),
    enquiryId: uuid('enquiry_id')
        .references(() => enquiries.id, { onDelete: 'cascade' })
        .notNull(),
    dayNumber: integer('day_number').notNull(), // Reorderable Sequence
    destination: text('destination').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    accommodation: text('accommodation'),
    meals: text('meals'), // e.g. "Breakfast, Lunch"
    activities: text('activities'),
});

export const bookings = pgTable('bookings', {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingRef: varchar('booking_ref', { length: 20 }).notNull().unique(), // e.g. "BT-2026-001"
    enquiryId: uuid('enquiry_id').references(() => enquiries.id),
    customerId: uuid('customer_id')
        .references(() => users.id)
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
    outstandingBalance: numeric('outstanding_balance', { precision: 12, scale: 2 }).notNull(), // Calculated: total - deposit
    paymentStatus: paymentStatusEnum('payment_status').default("Unpaid").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
});

// ==========================================
// 4. PROJECT 2: SUPPLIERS, RATES & AUDIT LOGS
// ==========================================

export const serviceRates = pgTable('service_rates', {
    id: uuid('id').defaultRandom().primaryKey(),
    supplierId: uuid('supplier_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    serviceName: text('service_name').notNull(),
    unitType: unitTypeEnum('unit_type').notNull(),
    cost: numeric('cost', { precision: 12, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).default('USD').notNull(),
    validFrom: timestamp('valid_from').notNull(),
    validUntil: timestamp('valid_until').notNull(),
    minGroupSize: integer('min_group_size').default(1),
    maxGroupSize: integer('max_group_size'),
    notes: text('notes'),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
});

export const supplierAvailability = pgTable('supplier_availability', {
    id: uuid('id').defaultRandom().primaryKey(),
    supplierId: uuid('supplier_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    date: timestamp('date').notNull(),
    status: availabilityStatusEnum('status').default("Available").notNull(),
});

// Price Audit Log System (Requirement: Suspicious Price Protection)
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
    changeReason: text('change_reason').notNull(), // Required when price changes > 30%
    isSuspicious: boolean('is_suspicious').default(false).notNull(), // Marked true if change > 30%
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
});

// ==========================================
// 5. DRIZZLE RELATIONS DEFINITION
// ==========================================

export const usersRelations = relations(users, ({ one, many }) => ({
    credentials: one(userCredentials, { fields: [users.id], references: [userCredentials.userId] }),
    images: many(images),
}));

export const userCredentialsRelations = relations(userCredentials, ({ one }) => ({
    user: one(users, {
        fields: [userCredentials.userId],
        references: [users.id],
    }),
}));

export const imagesRelations = relations(images, ({ one }) => ({
    user: one(users, {
        fields: [images.userId],
        references: [users.id],
    }),
    room: one(bookings, {
        fields: [images.bookingId],
        references: [bookings.id],
    }),
}));

export const enquiriesRelations = relations(enquiries, ({ one, many }) => ({
    customer: one(users, { fields: [enquiries.customerId], references: [users.id] }),
    assignedStaff: one(users, { fields: [enquiries.assignedStaffId], references: [users.id] }),
    itineraries: many(itineraries),
}));

export const itinerariesRelations = relations(itineraries, ({ one }) => ({
    enquiry: one(enquiries, { fields: [itineraries.enquiryId], references: [enquiries.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
    customer: one(users, { fields: [bookings.customerId], references: [users.id] }),
    assignedStaff: one(users, { fields: [bookings.assignedStaffId], references: [users.id] }),
    enquiry: one(enquiries, { fields: [bookings.enquiryId], references: [enquiries.id] }),
}));

export const suppliersRelations = relations(users, ({ many }) => ({
    serviceRates: many(serviceRates),
    availability: many(supplierAvailability),
}));

export const serviceRatesRelations = relations(serviceRates, ({ one, many }) => ({
    supplier: one(users, { fields: [serviceRates.supplierId], references: [users.id] }),
    priceHistories: many(priceHistories),
}));

export const priceHistoriesRelations = relations(priceHistories, ({ one }) => ({
    serviceRate: one(serviceRates, { fields: [priceHistories.serviceRateId], references: [serviceRates.id] }),
    changedBy: one(users, { fields: [priceHistories.changedByUserId], references: [users.id] }),
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