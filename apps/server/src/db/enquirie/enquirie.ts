import {
    pgTable,
    text,
    timestamp,
    integer,
    uuid,
    index,
    date,
} from 'drizzle-orm/pg-core';
import { users } from '../user';
import { enquiryStatusEnum } from './enum';

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
}, table => [
    index("enquiries_customer_id_idx").on(table.customerId),
    index("enquiries_status_idx").on(table.status),
]);