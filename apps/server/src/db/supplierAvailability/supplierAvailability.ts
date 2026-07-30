import {
    pgTable,
    timestamp,
    uuid,
    index,
} from 'drizzle-orm/pg-core';
import { users } from '../user';
import { availabilityStatusEnum } from './enum';

export const supplierAvailability = pgTable('supplier_availability', {
    id: uuid('id').defaultRandom().primaryKey(),
    supplierId: uuid('supplier_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    date: timestamp('date').notNull(),
    status: availabilityStatusEnum('status').default("Available").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("supplier_availability_supplier_id_idx").on(table.supplierId),
    index("supplier_availability_status_idx").on(table.status),
]);