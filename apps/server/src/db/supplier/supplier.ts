import {
    pgTable,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core';
import { users } from '../user';
import { supplierTypeEnum } from './enum';

export const suppliers = pgTable('suppliers', {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdById: uuid("created_by_id")
        .references(() => users.id, { onDelete: "set null" }),
    name: text('name').notNull(),
    type: supplierTypeEnum('type').notNull(),
    destination: text('destination').notNull(),
    contactPerson: text('contact_person'),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
});