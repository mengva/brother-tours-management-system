import { relations } from "drizzle-orm";
import { payments } from "./payment";
import { customers } from "../customer";
import { users } from "../user";
import { bookings } from "../booking";
import { invoices } from "../invoices";

export const paymentsRelations = relations(payments, ({ one }) => ({
    booking: one(bookings, { fields: [payments.bookingId], references: [bookings.id] }),
    invoice: one(invoices, { fields: [payments.invoiceId], references: [invoices.id] }),
    customer: one(customers, { fields: [payments.customerId], references: [customers.id] }),
    staff: one(users, { fields: [payments.staffId], references: [users.id] }),
}));