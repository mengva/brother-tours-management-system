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
import { bookings } from '../booking';
import { customers } from '../customer';
import { users } from '../user';
import { tours } from '../tour';
import { invoiceStatusEnum } from './enum';

// ---------------- 1. Invoices Table (ເພີ່ມໃໝ່ 🚀) ----------------
export const invoices = pgTable('invoices', {
    id: uuid('id').defaultRandom().primaryKey(),
    invoiceNo: text('invoice_no').notNull().unique(), // e.g. INV-202608-0001

    // 🔗 Foreign Keys
    bookingId: uuid('booking_id')
        .references(() => bookings.id, { onDelete: 'cascade' })
        .notNull(),
    customerId: uuid('customer_id')
        .references(() => customers.id, { onDelete: 'restrict' })
        .notNull(),
    issuedById: uuid('issued_by_id')
        .references(() => users.id, { onDelete: 'set null' }), // Staff ຄົນໃດເປັນຄົນອອກ Invoice ໃບນີ້
    tourId: uuid('tour_id').references(() => tours.id), //  ເພີ່ມ tourId

    // 💰 Amounts
    subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
    taxAmount: numeric('tax_amount', { precision: 12, scale: 2 }).default('0').notNull(), // ภาษี/VAT (ຖ້າມີ)
    discountAmount: numeric('discount_amount', { precision: 12, scale: 2 }).default('0').notNull(),
    totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(), // subtotal + tax - discount
    paidAmount: numeric('paid_amount', { precision: 12, scale: 2 }).default('0').notNull(), // ຍອດທີ່ຈ່າຍແລ້ວ
    dueAmount: numeric('due_amount', { precision: 12, scale: 2 }).notNull(), // ຍອດທີ່ຍັງເຫຼືອຕ້ອງຈ່າຍ

    status: invoiceStatusEnum('status').default('Draft').notNull(),

    // 📅 Dates
    issueDate: timestamp('issue_date', { withTimezone: true }).defaultNow().notNull(), // ວັນທີອອກໃບ
    dueDate: timestamp('due_date', { withTimezone: true }).notNull(), // ວັນທີຄົບກຳນົດຈ່າຍ

    notes: text('notes'), // ໝາຍເຫດ ເຊັ່ນ: "ລາຍລະອຽດເລກບັນຊີທະນາຄານສຳລັບໂອນ"

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index('invoices_booking_id_idx').on(table.bookingId),
    index('invoices_customer_id_idx').on(table.customerId),
    index('invoices_issued_by_id_idx').on(table.issuedById),
    index('invoices_tour_id_idx').on(table.tourId),
    index('invoices_status_idx').on(table.status),
]);
