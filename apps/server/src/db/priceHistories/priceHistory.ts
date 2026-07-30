import {
    pgTable,
    text,
    timestamp,
    numeric,
    boolean,
    uuid,
    index,
} from 'drizzle-orm/pg-core';
import { serviceRates } from '../serviceRate';
import { users } from '../user';

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
}, table => [
    index("price_histories_service_rate_id_idx").on(table.serviceRateId),
    index("price_histories_change_by_user_id_idx").on(table.changedByUserId),
]);