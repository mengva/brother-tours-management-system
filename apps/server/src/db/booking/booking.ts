import {
    pgTable,
    text,
    varchar,
    timestamp,
    integer,
    numeric,
    uuid,
    index,
} from 'drizzle-orm/pg-core';
import { users } from '../user';
import { paymentStatusEnum } from './enum';
import { enquiries } from '../enquirie';
import { customers } from '../customer';
import { tours } from '../tour';

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