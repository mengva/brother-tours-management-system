import {
    pgTable,
    varchar,
    timestamp,
    boolean,
    uuid,
    index,
} from 'drizzle-orm/pg-core';
import { userPermissionEnum, userRoleEnum } from './enum';

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: varchar("full_name", { length: 150 }).notNull(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }).unique().notNull(),
    gender: varchar("gender", { length: 20 }),

    isActive: boolean("is_active").default(true).notNull(),
    role: userRoleEnum("role").notNull(), // ADMIN, SALES, VIEWER
    permissions: userPermissionEnum("permissions").array().default([]),

    userAgent: varchar("user_agent", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
    index("users_active_idx").on(table.isActive),
    index("users_role_idx").on(table.role),
]);