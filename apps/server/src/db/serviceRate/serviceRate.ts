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
import { unitTypeEnum } from './enum';

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
}, table => [
    index("service_rate_supplier_id_idx").on(table.supplierId),
]);