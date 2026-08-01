import { index, pgTable, text, timestamp, uuid, numeric } from "drizzle-orm/pg-core";
import { paymentTxStatusEnum, paymentTypeEnum } from "./enum";
import { customers } from "../customer";
import { users } from "../user";
import { bookings } from "../booking";
import { invoices } from "../invoices";
import { tours } from "../tour";

// ---------------- 6. Payments Table (NEW 🚀) ----------------
export const payments = pgTable('payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingId: uuid('booking_id')
        .references(() => bookings.id, { onDelete: 'cascade' })
        .notNull(),
    tourId: uuid('tour_id').references(() => tours.id), //  ເພີ່ມ tourId
    invoiceId: uuid('invoice_id').references(() => invoices.id, { onDelete: 'set null' }),
    customerId: uuid('customer_id')
        .references(() => customers.id) // ແກ້ Foreign Key ໄປຫາ customers
        .notNull(),
    staffId: uuid('staff_id')
        .references(() => users.id),
    paymentNo: text('payment_no').notNull().unique(), // e.g. PAY-20260801-001
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    paymentType: paymentTypeEnum('payment_type').default("Full_Payment").notNull(),
    paymentMethod: text('payment_method').notNull(), // e.g. "ONEPAY", "BCEL_QR", "CASH", "BANK_TRANSFER"
    status: paymentTxStatusEnum('status').default("Pending").notNull(),
    notes: text('notes'), // ໝາຍເຫດ ເຊັ່ນ: "ລູກຄ້າໂອນຂາດ 50,000 ກີບ"
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index('payments_booking_id_idx').on(table.bookingId),
    index('payments_tour_id_idx').on(table.tourId),
    index('payments_invoice_id_idx').on(table.invoiceId),
    index('payments_customer_id_idx').on(table.customerId),
    index('payments_staff_id_idx').on(table.staffId),
    index('payments_payment_no_idx').on(table.paymentNo),
    index('payments_status_idx').on(table.status),
    index('payments_payment_type_idx').on(table.paymentType),
]);