import { relations } from "drizzle-orm";
import { tours } from "../tour";
import { customers } from "../customer";
import { users } from "../user";
import { invoices } from "./invoices";
import { bookings } from "../booking";
import { payments } from "../payment";

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
    booking: one(bookings, {
        fields: [invoices.bookingId],
        references: [bookings.id],
    }),
    tour: one(tours, {
        fields: [invoices.tourId],
        references: [tours.id],
    }),
    customer: one(customers, {
        fields: [invoices.customerId],
        references: [customers.id],
        relationName: 'customer_invoices',
    }),
    issuedBy: one(users, {
        fields: [invoices.issuedById],
        references: [users.id],
        relationName: 'staff_issued_invoices',
    }),
    payments: many(payments), // 1 Invoice ມີໄດ້ຫຼາຍ Payments (ຖ້າຈ່າຍຍ່ອຍ)
}));