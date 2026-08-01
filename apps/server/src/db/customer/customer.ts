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
import { users } from '../user';


// --- 2. CUSTOMERS TABLE (for travel/customer tour) ---
export const customers = pgTable('customers', {
    id: uuid("id").defaultRandom().primaryKey(),

    // (Optional) connection to User if the Customer has a Login Account
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),

    fullName: varchar("full_name", { length: 150 }).notNull(),
    whatsappNumber: varchar("whatsapp_number", { length: 30 }).unique().notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }).unique().notNull(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    gender: varchar("gender", { length: 20 }),
    birthDay: date("birth_day"),

    // Address (changed to Optional because some customers may not have an address)
    village: varchar("village", { length: 150 }),
    district: varchar("district", { length: 150 }),
    province: varchar("province", { length: 150 }),

    // Passport & Identity Info
    passportNumber: varchar("passport_number", { length: 100 }),
    passportExpiryDate: date("passport_expiry_date"),
    identityCardNumber: varchar("identity_card_number", { length: 100 }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
    index("customers_email_idx").on(table.email),
    index("customers_phone_idx").on(table.phoneNumber),
]);