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
import { customers } from '../customer';
import { tours } from '../tour';

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